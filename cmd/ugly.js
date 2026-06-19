module.exports = {
  config: { name: "ugly", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "😬 Ugly rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "😬 Ugly rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
