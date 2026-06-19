module.exports = {
  config: { name: "gcname", aliases: ["setname"], permission: 3, prefix: true, botAdmin: false, categorie: "Group", description: "Change group name.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (!args.length) return api.sendMessage(event.threadId, { text: "Usage: gcname <new name>" });
    await api.groupUpdateSubject(event.threadId, args.join(" "));
    api.sendMessage(event.threadId, { text: "✅ Group name updated." });
  }
};
