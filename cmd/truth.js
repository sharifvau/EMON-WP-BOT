module.exports = {
  config: { name: "truth", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Random truth", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Whats your biggest fear?","Last lie you told?","Worst date ever?"];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
