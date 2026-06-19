const os = require("os");
module.exports = {
  config: { name: "info", aliases: ["botinfo","stats"], permission: 0, prefix: false, categorie: "System", description: "Show system stats.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const mem = process.memoryUsage().rss/1024/1024;
    api.sendMessage(event.threadId, {
      text: `╭─ *${global.config.BOT_NAME}*\n│ Platform: ${os.platform()} ${os.arch()}\n│ Node: ${process.version}\n│ RAM: ${mem.toFixed(1)} MB\n│ CPU: ${os.cpus()[0].model}\n│ Commands: ${global.client.commands.size}\n│ Owner: ${global.config.OWNER_NAME}\n╰─ ${global.config.FOOTER}`
    }, { quoted: event.message });
  }
};
