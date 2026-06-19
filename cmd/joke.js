module.exports = {
  config: { name: "joke", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "Random joke", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ const a=["Why dont skeletons fight? They dont have the guts.","I told my wife she was drawing her eyebrows too high. She looked surprised.","Parallel lines have so much in common… its a shame theyll never meet."];return a[Math.floor(Math.random()*a.length)]; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
