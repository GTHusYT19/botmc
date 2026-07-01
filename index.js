const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'lipoutlolsmp.aternos.me',
  port: 53096,
  username: 'TonNomDeBot'
});

bot.on('spawn', () => {
  // Attendre un court instant que le chargement soit complet
  setTimeout(() => {
    bot.chat('/login Yasir2009##');
  }, 2000);
});

// Relance automatique en cas de déconnexion
bot.on('end', () => {
  setTimeout(() => {
    // Logique de reconnexion
  }, 5000);
});