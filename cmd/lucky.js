module.exports = {
  config: { name: "lucky", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🍀 Lucky rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🍀 Lucky rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
