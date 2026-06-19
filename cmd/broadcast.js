module.exports = {
  config: { name: "broadcast", aliases:["bc"], permission: 2, prefix: true, categorie: "Owner", description: "Broadcast to all groups.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const text = args.join(" ");
    if (!text) return api.sendMessage(event.threadId, { text: "Usage: bc <text>" });
    const groups = Object.keys(await api.groupFetchAllParticipating());
    for (const g of groups) { try { await api.sendMessage(g, { text: `📢 *BROADCAST*\n\n${text}\n\n${global.config.FOOTER}` }); } catch {} }
    api.sendMessage(event.threadId, { text: `✅ Sent to ${groups.length} groups.` });
  }
};
