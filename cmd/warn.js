module.exports = {
  config: { name: "warn", permission: 3, prefix: true, categorie: "Moderation", description: "Warn a user.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    const t = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!t) return api.sendMessage(event.threadId, { text: "Mention/reply user." });
    const key = `${event.threadId}:${t}`;
    global.db.warnings[key] = (global.db.warnings[key]||0) + 1;
    global.saveDB();
    api.sendMessage(event.threadId, { text: `⚠️ Warned @${t.split("@")[0]} (${global.db.warnings[key]}/3) — ${args.join(" ")||"No reason"}`, mentions:[t] });
    if (global.db.warnings[key] >= 3) {
      try { await api.groupParticipantsUpdate(event.threadId, [t], "remove"); api.sendMessage(event.threadId, { text: "👢 Auto-kicked (3 warnings)." }); delete global.db.warnings[key]; global.saveDB(); } catch {}
    }
  }
};
