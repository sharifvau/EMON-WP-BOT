module.exports = {
  config: { name: "warnings", aliases:["warns"], permission: 0, prefix: false, categorie: "Moderation", description: "Show your warnings.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    const t = ctx?.mentionedJid?.[0] || ctx?.participant || event.senderId;
    const key = `${event.threadId}:${t}`;
    api.sendMessage(event.threadId, { text: `⚠️ @${t.split("@")[0]} has ${global.db.warnings[key]||0}/3 warnings.`, mentions:[t] });
  }
};
