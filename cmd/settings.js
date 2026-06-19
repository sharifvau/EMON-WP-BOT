module.exports = {
  config: { name: "settings", permission: 2, prefix: true, categorie: "Owner", description: "Toggle bot settings.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const keys = ["AUTO_DOWNLOAD_LINKS","REPLY_TO_INBOX","REPLY_TO_SELF","ALLOW_NO_PREFIX","AUTO_READ","AUTO_TYPING"];
    if (!args[0]) return api.sendMessage(event.threadId, { text: "Settings:\n"+keys.map(k=>`• ${k} = ${global.config[k]}`).join("\n")+"\n\nUse: settings <key> on|off" });
    const k = args[0].toUpperCase(), v = (args[1]||"").toLowerCase();
    if (!keys.includes(k)) return api.sendMessage(event.threadId, { text: "Unknown key." });
    global.config[k] = (v==="on");
    api.sendMessage(event.threadId, { text: `✅ ${k} = ${global.config[k]}` });
  }
};
