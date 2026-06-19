module.exports = {
  config: { name: "smart", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🧠 Smart rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🧠 Smart rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
