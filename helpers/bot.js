const bot = require('../modules/wit-ai');

module.exports = {
  ask: bot.message,
  answer: (r) => { return r; }
};