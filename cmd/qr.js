const axios = require("axios");
module.exports = {
  config: { name: "qr", permission: 0, prefix: false, categorie: "Tools", description: "Generate a QR code.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const t = args.join(" ");
    if (!t) return api.sendMessage(event.threadId, { text: "Usage: qr <text>" });
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(t)}`;
    const buf = (await axios.get(url, { responseType: "arraybuffer" })).data;
    api.sendMessage(event.threadId, { image: Buffer.from(buf), caption: `📱 QR for: ${t}` }, { quoted: event.message });
  }
};
