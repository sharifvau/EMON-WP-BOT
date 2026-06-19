module.exports = {
  config: { name: "gay", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🌈 Gay rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🌈 Gay rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
