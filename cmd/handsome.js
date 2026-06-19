module.exports = {
  config: { name: "handsome", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "✨ Handsome rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "✨ Handsome rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
