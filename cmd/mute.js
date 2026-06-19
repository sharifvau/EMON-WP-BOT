module.exports = {
  config: { 
    name: "mute", 
    aliases: ["gcmute"], 
    permission: 2, 
    prefix: true, 
    botAdmin: false, 
    categorie: "Group", 
    description: "Mute the group for a specific time.", 
    credit: "EMON HAWLADAR" 
  },
  start: async ({ api, event, args }) => {
    const timeStr = args[0]; // যেমন: 30s, 1m, 1h, 1d
    if (!timeStr) {
        // যদি কোনো সময় না দেয়, শুধু লক করে রাখবে
        await api.groupSettingUpdate(event.threadId, 'announcement');
        return api.sendMessage(event.threadId, { text: "🔇 Group muted indefinitely." });
    }

    const timeInMs = parseTime(timeStr);
    if (!timeInMs) return api.sendMessage(event.threadId, { text: "⚠️ Invalid format! Use: 30s, 1m, 1h, 1d" });

    await api.groupSettingUpdate(event.threadId, 'announcement');
    api.sendMessage(event.threadId, { text: `🔇 Group muted for ${timeStr}.` });

    setTimeout(async () => {
        await api.groupSettingUpdate(event.threadId, 'not_announcement');
        api.sendMessage(event.threadId, { text: "🔓 Time's up! Group unmuted." });
    }, timeInMs);
  }
};

function parseTime(str) {
    const unit = str.slice(-1);
    const val = parseInt(str);
    if (unit === 's') return val * 1000;
    if (unit === 'm') return val * 60000;
    if (unit === 'h') return val * 3600000;
    if (unit === 'd') return val * 86400000;
    return null;
}
