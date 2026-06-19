const axios = require("axios");
module.exports = {
  config: { name: "tr", aliases: ["translate"], permission: 0, prefix: false, cooldowns: 3, categorie: "Tools", description: "Translate text. Usage: tr <lang> <text>", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (args.length < 2) return api.sendMessage(event.threadId, { text: "Usage: tr <lang-code> <text>" });
    const lang = args.shift();
    const text = args.join(" ");
    try {
      const r = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${lang}`);
      api.sendMessage(event.threadId, { text: `🌐 ${r.data.responseData.translatedText}` }, { quoted: event.message });
    } catch { api.sendMessage(event.threadId, { text: "❌ Translation failed." }); }
  }
};
