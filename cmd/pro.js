module.exports = {
  config: { name: "pro", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🏆 Pro rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🏆 Pro rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
