module.exports = {
  config: { name: "dare", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Random dare", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Do 10 pushups now.","Sing a song in voice.","Send your last selfie."];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
