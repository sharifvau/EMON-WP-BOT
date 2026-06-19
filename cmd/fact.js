module.exports = {
  config: { name: "fact", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Fun fact", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Honey never spoils.","Octopuses have 3 hearts.","Bananas are berries; strawberries arent."];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
