module.exports = {
  config: { name: "owner", aliases: ["dev","creator"], permission: 0, prefix: false, categorie: "System", description: "Show owner info.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const c = global.config;
    api.sendMessage(event.threadId, {
      text: `╭━━━ *BOT OWNER* ━━━╮\n│ 👑 ${c.OWNER_NAME}\n│ 📱 ${c.OWNERS[0]}\n│ 📧 ${c.OWNER_EMAIL}\n│ 🤖 ${c.BOT_NAME}\n╰━━━━━━━━━━━━━━━╯\n${c.FOOTER}`
    }, { quoted: event.message });
  }
};
