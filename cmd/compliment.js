module.exports = {
  config: { name: "compliment", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Compliment", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Youre amazing.","Youre a star ✨","You inspire others."];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
