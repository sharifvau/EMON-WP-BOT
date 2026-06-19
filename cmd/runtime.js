const moment = require("moment-timezone");
module.exports = {
  config: { name: "runtime", permission: 0, prefix: false, categorie: "System", description: "Bot started since.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => api.sendMessage(event.threadId, { text: `⏱️ Node uptime: ${(process.uptime()/3600).toFixed(2)}h\n🕒 ${moment().tz(global.config.TIMEZONE).format()}` }, { quoted: event.message })
};
