module.exports = {
  config: { name: "crazy", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "🤪 Crazy rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "🤪 Crazy rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
