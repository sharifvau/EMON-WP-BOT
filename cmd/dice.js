module.exports = {
  config: { name: "dice", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "dice command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ return "🎲 " + (1+Math.floor(Math.random()*6)); })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
