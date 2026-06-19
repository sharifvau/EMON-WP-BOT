module.exports = {
  config: { name: "gcinfo", aliases: ["groupinfo"], permission: 0, prefix: false, categorie: "Group", description: "Show group info.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    if (!event.isGroup) return;
    const m = await api.groupMetadata(event.threadId);
    api.sendMessage(event.threadId, { text: `📛 ${m.subject}\n👥 ${m.participants.length} members\n👑 Owner: ${m.owner||"-"}\n📝 ${m.desc||"-"}\n${global.config.FOOTER}` }, { quoted: event.message });
  }
};
