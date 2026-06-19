module.exports = {
  config: { name: "addowner", permission: 2, prefix: true, categorie: "Owner", description: "Add multi-owner.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const n = (args[0]||"").replace(/[^0-9]/g,"");
    if (!n) return api.sendMessage(event.threadId, { text: "Usage: addowner <number>" });
    if (global.config.OWNERS.includes(n)) return api.sendMessage(event.threadId, { text: "Already an owner." });
    global.config.OWNERS.push(n);
    api.sendMessage(event.threadId, { text: `✅ ${n} added as owner (runtime only — also edit Emon/config.js to persist).` });
  }
};
