module.exports = {
  config: { 
    name: "unmute", 
    aliases: ["gcunmute"], 
    permission: 2, 
    prefix: true, 
    botAdmin: false, 
    categorie: "Group", 
    description: "Unmute the group (Everyone can message).", 
    credit: "EMON HAWLADAR" 
  },
  start: async ({ api, event }) => {
    await api.groupSettingUpdate(event.threadId, 'not_announcement');
    api.sendMessage(event.threadId, { text: "🔓 Group unmuted. Everyone can send messages now." });
  }
};
