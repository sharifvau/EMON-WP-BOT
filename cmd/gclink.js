module.exports = {
  config: { name: "gclink", aliases: ["grouplink"], permission: 3, prefix: true, botAdmin: false, categorie: "Group", description: "Get group invite link.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const code = await api.groupInviteCode(event.threadId);
    api.sendMessage(event.threadId, { text: `🔗 https://chat.whatsapp.com/${code}` }, { quoted: event.message });
  }
};
