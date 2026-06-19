module.exports = {
  config: { name: "say", aliases: ["echo"], permission: 0, prefix: false, categorie: "Tools", description: "Bot says it.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => api.sendMessage(event.threadId, { text: args.join(" ")||"…" })
};
