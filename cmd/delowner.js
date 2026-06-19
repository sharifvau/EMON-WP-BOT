module.exports = {
  config: { name: "delowner", permission: 2, prefix: true, categorie: "Owner", description: "Remove an owner (runtime).", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const n = (args[0]||"").replace(/[^0-9]/g,"");
    if (!n) return;
    global.config.OWNERS = global.config.OWNERS.filter(o => o !== n);
    api.sendMessage(event.threadId, { text: `✅ Removed ${n}` });
  }
};
