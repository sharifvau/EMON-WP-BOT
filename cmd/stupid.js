module.exports = {
  config: { name: "stupid", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🤡 Stupid rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🤡 Stupid rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
