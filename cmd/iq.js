module.exports = {
  config: { name: "iq", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "iq command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ return "🧠 IQ: " + (50+Math.floor(Math.random()*150)); })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
