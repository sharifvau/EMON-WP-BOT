module.exports = {
  config: { name: "tagall", aliases: ["all","everyone"], permission: 3, prefix: false, botAdmin: false, categorie: "Group", description: "Tag all group members.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (!event.isGroup) return api.sendMessage(event.threadId, { text: "Group only." }, { quoted: event.message });
    const meta = await api.groupMetadata(event.threadId);
    const mentions = meta.participants.map(p => p.id);
    const txt = (args.join(" ") || "📢 Attention everyone!") + "\n\n" + mentions.map(j => "@" + j.split("@")[0]).join(" ");
    api.sendMessage(event.threadId, { text: txt, mentions });
  }
};
