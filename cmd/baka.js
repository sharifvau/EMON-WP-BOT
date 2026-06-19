module.exports = {
  config: { name: "baka", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🤓 Baka rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🤓 Baka rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
