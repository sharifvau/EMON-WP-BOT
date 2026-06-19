module.exports = {
  config: { name: "calc", aliases: ["math"], permission: 0, prefix: false, categorie: "Tools", description: "Simple calculator.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const expr = args.join(" ").replace(/[^0-9+\-*/().% ]/g, "");
    if (!expr) return api.sendMessage(event.threadId, { text: "Usage: calc 2+2*3" });
    try {
      const r = Function(`"use strict";return (${expr})`)();
      api.sendMessage(event.threadId, { text: `🧮 ${expr} = ${r}` }, { quoted: event.message });
    } catch { api.sendMessage(event.threadId, { text: "❌ Invalid expression." }); }
  }
};
