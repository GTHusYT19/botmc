const express = require('express');
const mineflayer = require('mineflayer');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const CONFIG_FILE = './config.json';

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    const def = { host: 'lipoutlolsmp.aternos.me', port: 53096, username: 'TonNomDeBot', version: '1.20.1', botEnabled: false };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(def, null, 2));
    return def;
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

function saveConfig(c) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(c, null, 2));
}

let bot = null;
let config = loadConfig();
let connectedAt = null;
let chatLogs = [];
let statusLog = [];

function addStatus(msg) {
  statusLog.unshift({ time: new Date().toLocaleTimeString('fr-FR'), text: msg });
  if (statusLog.length > 50) statusLog.pop();
  console.log(`[AFK Bot] ${msg}`);
}

function addChat(username, message, type = 'chat') {
  chatLogs.unshift({ time: new Date().toLocaleTimeString('fr-FR'), username, message, type });
  if (chatLogs.length > 100) chatLogs.pop();
}

// Patch prismarine-chat pour ignorer les formats inconnus au lieu de crasher
function patchChatParsing() {
  try {
    const chatModule = require('prismarine-chat')('1.20.1');
    const proto = chatModule.prototype || Object.getPrototypeOf(chatModule);
    if (proto && proto.fromNetwork) {
      const orig = proto.fromNetwork;
      proto.fromNetwork = function(type, packet) {
        try { return orig.call(this, type, packet); } catch (e) {
          if (e.message && e.message.includes('unknown chat format code')) return null;
          throw e;
        }
      };
    }
  } catch (e) {}
}

function patchBotClient(b) {
  if (!b || !b._client) return;
  const origEmit = b._client.emit.bind(b._client);
  b._client.emit = function(event, ...args) {
    try {
      return origEmit(event, ...args);
    } catch (e) {
      if (e.message && e.message.includes('unknown chat format code')) {
        // Message non reconnu — on l'ignore silencieusement
        return false;
      }
      throw e;
    }
  };
}

function startBot() {
  if (bot) return;
  config = loadConfig();
  if (!config.botEnabled) { addStatus('Bot désactivé.'); return; }

  addStatus(`Connexion à ${config.host}:${config.port} en tant que ${config.username}...`);

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: 'offline',
    checkTimeoutInterval: 30000,
  });

  // Patch l'émetteur d'événements du client pour ignorer les erreurs de format inconnu
  patchBotClient(bot);

  bot.on('spawn', () => {
    connectedAt = Date.now();
    addStatus('Bot connecté et prêt !');
    const pwd = process.env.BOT_PASSWORD;
    if (pwd) {
      setTimeout(() => { try { bot.chat(`/login ${pwd}`); } catch (e) {} }, 2000);
    } else {
      addStatus('⚠️ BOT_PASSWORD non défini — /login ignoré.');
    }
    keepAlive();
  });

  // Chat public
  bot.on('chat', (username, message) => {
    try { addChat(username, message, 'chat'); } catch (e) {}
  });

  // Messages privés — /msg et /r
  bot.on('whisper', (username, message) => {
    try {
      addChat(username, message, 'whisper');
      addStatus(`Whisper de ${username} : ${message}`);
    } catch (e) {}
  });

  // Messages système + détection format privé [[EXPÉDITEUR]] DESTINATAIRE message
  bot.on('message', (jsonMsg) => {
    try {
      const text = jsonMsg.toString().trim();
      if (!text) return;

      // Format msg privé du serveur : [[PIX0O]] GuerrierSayan bonjour
      const pmMatch = text.match(/^\[\[([^\]]+)\]\]\s+(\S+)\s+(.+)$/);
      if (pmMatch) {
        const sender    = pmMatch[1];
        const recipient = pmMatch[2];
        const content   = pmMatch[3];
        addChat(`${sender} → ${recipient}`, content, 'whisper');
        addStatus(`MP : [${sender} → ${recipient}] ${content}`);
        return;
      }

      // Évite les doublons avec les events chat et whisper
      const last = chatLogs[0];
      if (last && last.message === text) return;
      addChat('Serveur', text, 'system');
    } catch (e) {}
  });

  bot.on('kicked', (reason) => {
    addStatus(`Expulsé : ${reason}`);
    connectedAt = null; bot = null;
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    if (err.message && err.message.includes('unknown chat format code')) return;
    addStatus(`Erreur : ${err.message}`);
    connectedAt = null; bot = null;
    setTimeout(startBot, 5000);
  });

  bot.on('end', () => {
    addStatus('Déconnecté.');
    connectedAt = null; bot = null;
    config = loadConfig();
    if (config.botEnabled) {
      addStatus('Reconnexion dans 5s...');
      setTimeout(startBot, 5000);
    }
  });
}

function keepAlive() {
  const interval = setInterval(() => {
    if (!bot) { clearInterval(interval); return; }
    try {
      bot.setControlState('jump', true);
      setTimeout(() => bot && bot.setControlState('jump', false), 200);
    } catch (e) {}
  }, 30000);
}

function stopBot() {
  if (bot) { try { bot.quit(); } catch (e) {} bot = null; connectedAt = null; }
}

process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('unknown chat format code')) {
    // Erreur connue de prismarine-chat — on ignore, le bot reste connecté
    return;
  }
  addStatus(`Erreur non gérée : ${err.message}`);
  if (bot) { try { bot.quit(); } catch (e) {} bot = null; connectedAt = null; }
  config = loadConfig();
  if (config.botEnabled) setTimeout(startBot, 5000);
});

process.on('unhandledRejection', (reason) => {
  addStatus(`Promesse rejetée : ${reason}`);
});

// --- API ---

app.get('/api/status', (req, res) => {
  const uptime = connectedAt ? Math.floor((Date.now() - connectedAt) / 1000) : 0;
  res.json({ connected: !!bot, config: loadConfig(), uptime, statusLog: statusLog.slice(0, 20), chatLogs: chatLogs.slice(0, 50) });
});

app.post('/api/toggle', (req, res) => {
  config = loadConfig();
  config.botEnabled = !config.botEnabled;
  saveConfig(config);
  if (config.botEnabled) { startBot(); }
  else { stopBot(); addStatus('Bot désactivé par le panel.'); }
  res.json({ botEnabled: config.botEnabled });
});

app.post('/api/config', (req, res) => {
  const { host, port, username, version } = req.body;
  config = loadConfig();
  if (host) config.host = host;
  if (port) config.port = parseInt(port);
  if (username) config.username = username;
  if (version) config.version = version;
  saveConfig(config);
  addStatus(`Config mise à jour : ${config.host}:${config.port}`);
  res.json({ success: true, config });
});

app.listen(5000, '0.0.0.0', () => {
  console.log('[Panel] Serveur démarré sur le port 5000');
  startBot();
});
