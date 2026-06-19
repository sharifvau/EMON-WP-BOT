module.exports = {
  config: { name: "ping", aliases: ["p"], permission: 0, prefix: false, cooldowns: 2, categorie: "System", description: "Check bot latency.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const t = Date.now();
    const s = await api.sendMessage(event.threadId, { text: "🏓 Pinging..." }, { quoted: event.message });
    await api.sendMessage(event.threadId, { text: `🏓 Pong!\n⚡ ${Date.now()-t}ms\n${global.config.FOOTER}`, edit: s.key });
  }
};
