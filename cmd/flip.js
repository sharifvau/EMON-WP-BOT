module.exports = {
  config: { name: "flip", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "flip command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ return Math.random()<0.5?"🪙 Heads":"🪙 Tails"; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
