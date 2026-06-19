module.exports = {
  config: { name: "rps", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "rps command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["🪨 Rock","📄 Paper","✂️ Scissors"];return "Bot: " + a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
