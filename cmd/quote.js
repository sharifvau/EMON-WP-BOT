module.exports = {
  config: { name: "quote", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Random quote", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Be yourself; everyone else is taken. – Wilde","Stay hungry, stay foolish. – Jobs","The best way out is always through. – Frost"];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
