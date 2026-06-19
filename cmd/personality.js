module.exports = {
  config: { name: "personality", aliases: ["persona","setai"], permission: 3, prefix: true, categorie: "AI", description: "Set per-group AI personality.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (!args.length) {
      const cur = global.settings.groupPersonality?.[event.threadId] || global.config.AI.personality;
      return api.sendMessage(event.threadId, { text: `Current personality:\n${cur}\n\nUsage: personality <new text> | reset` });
    }
    if (args[0] === "reset") { delete global.settings.groupPersonality[event.threadId]; global.saveSettings(); return api.sendMessage(event.threadId, { text: "✅ Reset." }); }
    global.settings.groupPersonality[event.threadId] = args.join(" ");
    global.saveSettings();
    api.sendMessage(event.threadId, { text: "✅ Personality updated." });
  }
};
