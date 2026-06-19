module.exports = {
  config: { name: "lock", aliases: ["unlock"], permission: 2, prefix: true, botAdmin: false, categorie: "Group", description: "Lock/Unlock group.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const action = event.body.includes("unlock") ? "not_announcement" : "announcement";
    const msg = event.body.includes("unlock") ? "🔓 Group unlocked." : "🔒 Group locked.";
    await api.groupSettingUpdate(event.threadId, action);
    api.sendMessage(event.threadId, { text: msg });
  }
};
