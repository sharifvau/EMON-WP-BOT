module.exports = {
  config: { name: "kick", aliases: ["out","remove"], permission: 3, prefix: true, botAdmin: false, categorie: "Group", description: "Kick a user.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const ctx = event.message.message?.extendedTextMessage?.contextInfo;
    let target = ctx?.mentionedJid?.[0] || ctx?.participant;
    if (!target) return api.sendMessage(event.threadId, { text: "Mention or reply to a user." }, { quoted: event.message });
    await api.groupParticipantsUpdate(event.threadId, [target], "remove");
    api.sendMessage(event.threadId, { text: `👢 Kicked @${target.split("@")[0]}`, mentions: [target] });
  }
};
