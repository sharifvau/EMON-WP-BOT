module.exports = {
  config: { name: "rich", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "💰 Rich rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "💰 Rich rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
