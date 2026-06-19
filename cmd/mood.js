module.exports = {
  config: { name: "mood", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "mood command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["😊 Happy","😢 Sad","😡 Angry","😴 Sleepy","🥳 Party"];return "Mood: " + a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
