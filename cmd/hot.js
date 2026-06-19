module.exports = {
  config: { name: "hot", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🔥 Hot rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🔥 Hot rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
