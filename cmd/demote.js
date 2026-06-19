module.exports = {
  config: { name: "demote", aliases: ["dm"], permission: 3, prefix: true, botAdmin: false, categorie: "Group", description: "Demote an admin.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    const t = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!t) return api.sendMessage(event.threadId, { text: "Mention/reply a user." }, { quoted: event.message });
    await api.groupParticipantsUpdate(event.threadId, [t], "demote");
    api.sendMessage(event.threadId, { text: `⬇️ Demoted @${t.split("@")[0]}`, mentions:[t] });
  }
};
