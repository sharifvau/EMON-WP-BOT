module.exports = {
  config: { name: "leave", permission: 2, prefix: true, categorie: "Group", description: "Bot leaves the group.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    if (!event.isGroup) return;
    await api.sendMessage(event.threadId, { text: "👋 Goodbye!" });
    await api.groupLeave(event.threadId);
  }
};
