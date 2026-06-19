const start = Date.now();
module.exports = {
  config: { name: "uptime", aliases: ["up"], permission: 0, prefix: false, categorie: "System", description: "Show bot uptime.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const s = Math.floor((Date.now()-start)/1000);
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    api.sendMessage(event.threadId, { text: `⏱️ *Uptime:* ${h}h ${m}m ${sec}s\n📊 Commands run: ${global.db.stats.commandsRun||0}\n👁 Messages seen: ${global.db.stats.messagesSeen||0}\n${global.config.FOOTER}` }, { quoted: event.message });
  }
};
