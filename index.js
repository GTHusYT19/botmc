const mineflayer = require('mineflayer');
const fs = require('fs');

const CONFIG_FILE = './config.json';

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      host: 'lipoutlolsmp.aternos.me',
      port: 53096,
      username: 'GTHusYT',
      version: '1.21.4',
      botEnabled: false,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
  return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
}

let bot = null;
let config = loadConfig();

function startBot() {
  if (bot) return;
  config = loadConfig();

  if (!config.botEnabled) {
    console.log('[AFK Bot] Bot désactivé — modifie config.json pour l\'activer.');
    return;
  }

  console.log(`[AFK Bot] Connexion à ${config.host}:${config.port} en tant que ${config.username}...`);

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    auth: 'offline',
    checkTimeoutInterval: 30000,
  });

  bot.on('spawn', () => {
    console.log('Bot connecté et prêt !');

    setTimeout(() => {
      try {
        bot.chat('/login YourPassword');
      } catch (e) {
        console.error('[AFK Bot] Erreur /login :', e.message);
      }
    }, 2000);

    keepAlive();
  });

  bot.on('chat', (username, message) => {
    try {
      console.log(`[Chat] <${username}> ${message}`);
    } catch (e) {
      // Ignore les erreurs de parsing de message
    }
  });

  bot.on('message', (jsonMsg) => {
    try {
      console.log(`[Message] ${jsonMsg.toString()}`);
    } catch (e) {
      // Ignore les formats de message non reconnus
    }
  });

  bot.on('kicked', (reason) => {
    console.log('[AFK Bot] Expulsé :', reason);
    bot = null;
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('[AFK Bot] Erreur :', err.message);
    bot = null;
    setTimeout(startBot, 5000);
  });

  bot.on('end', () => {
    console.log('[AFK Bot] Déconnecté.');
    bot = null;
    config = loadConfig();
    if (config.botEnabled) {
      console.log('[AFK Bot] Reconnexion dans 5s...');
      setTimeout(startBot, 5000);
    }
  });
}

function keepAlive() {
  setInterval(() => {
    if (!bot) return;
    try {
      bot.setControlState('jump', true);
      setTimeout(() => bot && bot.setControlState('jump', false), 200);
    } catch (e) {
      // Ignore
    }
  }, 30000);
}

function stopBot() {
  if (bot) {
    try { bot.quit(); } catch (e) {}
    bot = null;
    console.log('[AFK Bot] Bot arrêté.');
  }
}

// Empêche le crash sur les erreurs non gérées — relance le bot à la place
process.on('uncaughtException', (err) => {
  console.error('[AFK Bot] Erreur non gérée :', err.message);
  if (bot) {
    try { bot.quit(); } catch (e) {}
    bot = null;
  }
  config = loadConfig();
  if (config.botEnabled) {
    console.log('[AFK Bot] Reconnexion dans 5s...');
    setTimeout(startBot, 5000);
  }
});

process.on('unhandledRejection', (reason) => {
  console.error('[AFK Bot] Promesse rejetée :', reason);
});

startBot();

process.on('SIGINT', () => {
  stopBot();
  process.exit();
});
