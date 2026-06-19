module.exports = {
  config: { name: "prefix", permission: 0, prefix: false, categorie: "System", description: "Show current prefix.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => api.sendMessage(event.threadId, { text: `Current prefix: *${global.config.PREFIX}*\nNo-prefix mode: ${global.config.ALLOW_NO_PREFIX ? "ON ✅" : "OFF ❌"}` }, { quoted: event.message })
};
