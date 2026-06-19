module.exports = {
  config: { name: "eightball", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "eightball command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Yes.","No.","Maybe.","Ask again later.","Definitely.","Doubtful."];return "🎱 " + a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
