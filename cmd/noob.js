module.exports = {
  config: { name: "noob", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🐣 Noob rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🐣 Noob rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
