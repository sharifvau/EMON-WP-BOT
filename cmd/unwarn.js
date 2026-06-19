module.exports = {
  config: { name: "unwarn", permission: 3, prefix: true, categorie: "Moderation", description: "Remove warning.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    const t = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!t) return;
    const key = `${event.threadId}:${t}`;
    if (global.db.warnings[key]) { global.db.warnings[key]--; if (!global.db.warnings[key]) delete global.db.warnings[key]; }
    global.saveDB();
    api.sendMessage(event.threadId, { text: `✅ Warning removed. Now: ${global.db.warnings[key]||0}` });
  }
};
