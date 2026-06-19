module.exports = {
  config: { name: "cute", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🥰 Cute rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🥰 Cute rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
