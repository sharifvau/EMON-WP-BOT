module.exports = {
  config: { name: "cool", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "😎 Cool rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "😎 Cool rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
