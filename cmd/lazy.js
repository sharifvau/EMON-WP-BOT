module.exports = {
  config: { name: "lazy", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "😴 Lazy rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "😴 Lazy rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
