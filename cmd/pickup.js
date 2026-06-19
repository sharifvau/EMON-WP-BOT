module.exports = {
  config: { name: "pickup", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Pickup line", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Are you Wi-Fi? Because I feel a connection.","Did it hurt? When you fell from heaven?"];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
