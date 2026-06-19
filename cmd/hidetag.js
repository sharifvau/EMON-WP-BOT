module.exports = {
  config: { name: "hidetag", aliases: ["ht"], permission: 3, prefix: true, categorie: "Group", description: "Send a hidden tag to all.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (!event.isGroup) return;
    const meta = await api.groupMetadata(event.threadId);
    const mentions = meta.participants.map(p => p.id);
    api.sendMessage(event.threadId, { text: args.join(" ") || "👀", mentions });
  }
};
