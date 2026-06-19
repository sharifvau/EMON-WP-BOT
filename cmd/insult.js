module.exports = {
  config: { name: "insult", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Roast", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["You bring everyone joy when you leave the room.","Youre the human equivalent of a participation trophy."];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
