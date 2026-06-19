module.exports = {
  config: { name: "restart", aliases: ["rs"], permission: 2, prefix: true, categorie: "Owner", description: "Restart the bot.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    await api.sendMessage(event.threadId, { text: "♻️ Restarting EMON BOT..." }, { quoted: event.message });
    setTimeout(() => process.exit(0), 1500);
  }
};
