module.exports = {
  config: { name: "promote", aliases: ["pr"], permission: 3, prefix: true, botAdmin: false, categorie: "Group", description: "Promote a user.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    const t = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!t) return api.sendMessage(event.threadId, { text: "Mention/reply a user." }, { quoted: event.message });
    await api.groupParticipantsUpdate(event.threadId, [t], "promote");
    api.sendMessage(event.threadId, { text: `⬆️ Promoted @${t.split("@")[0]}`, mentions:[t] });
  }
};
