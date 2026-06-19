module.exports = {
  config: { name: "hack", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "hack command.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const r = (function(){ return "💻 Hacking... 100% done. (Just kidding 😄)"; })();
    api.sendMessage(event.threadId, { text: r }, { quoted: event.message });
  }
};
