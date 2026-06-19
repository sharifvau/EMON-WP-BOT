module.exports = {
  config: { name: "simp", permission: 0, prefix: false, cooldowns: 2, categorie: "Fun", description: "😍 Simp rate generator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    api.sendMessage(event.threadId, { text: "😍 Simp rate: " + Math.floor(Math.random()*101) + "%" }, { quoted: event.message });
  }
};
