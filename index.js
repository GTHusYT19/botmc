const mineflayer = require('mineflayer');
const fs = require('fs');

const CONFIG_FILE = './config.json';

function loadConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      host: 'lipoutlolsmp.aternos.me',
      port: 53096,
      username: 'TonNomDeBot',
      version: '1.20.1',
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
  });

  bot.on('spawn', () => {
    console.log('Bot connecté et prêt !');

    setTimeout(() => {
      bot.chat('/login Yasir2009##');
    }, 2000);

    keepAlive();
  });

  bot.on('chat', (username, message) => {
    console.log(`[Chat] <${username}> ${message}`);
    // Bot AFK — ne répond pas aux messages
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
    bot.setControlState('jump', true);
    setTimeout(() => bot && bot.setControlState('jump', false), 200);
  }, 30000);
}

function stopBot() {
  if (bot) {
    bot.quit();
    bot = null;
    console.log('[AFK Bot] Bot arrêté.');
  }
}

startBot();

process.on('SIGINT', () => {
  stopBot();
  process.exit();
});
