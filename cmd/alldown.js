const axios = require("axios");
const fs = require("fs");
const path = require("path");
const LINK_RX = /(https?:\/\/[^\s]+(facebook\.com|fb\.watch|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|pinterest\.com)[^\s]*)/i;

async function download(api, threadId, message, url, react) {
  try {
    await react?.("⏳");
    const { data } = await axios.get(`https://nayan-video-downloader.vercel.app/alldown?url=${encodeURIComponent(url)}`, { timeout: 60000 });
    const vd = data?.data;
    if (!vd) { await react?.("❌"); return api.sendMessage(threadId, { text: "❌ Failed to fetch video." }, { quoted: message }); }
    const link = vd.low || vd.high || vd.video;
    if (!link) { await react?.("❌"); return; }
    const file = path.join(__dirname, "cache", `dl_${Date.now()}.mp4`);
    const res = await axios({ url: link, method: "GET", responseType: "stream", timeout: 120000 });
    await new Promise((ok, no) => { const w = fs.createWriteStream(file); res.data.pipe(w); w.on("finish", ok); w.on("error", no); });
    await react?.("✅");
    await api.sendMessage(threadId, { video: fs.readFileSync(file), caption: `🎥 ${vd.title || "Downloaded"}\n${global.config.FOOTER}` }, { quoted: message });
    fs.unlink(file, () => {});
  } catch (e) { await react?.("❌"); api.sendMessage(threadId, { text: "❌ Download failed: " + e.message }, { quoted: message }); }
}

module.exports = {
  config: { name: "alldown", aliases: ["vd","dl","download"], permission: 0, prefix: false, categorie: "Downloader", description: "Auto download video from any link.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    const url = (args[0]||"").trim();
    if (!url.startsWith("http")) return api.sendMessage(event.threadId, { text: "Usage: alldown <url>" }, { quoted: event.message });
    return download(api, event.threadId, event.message, url, event.react);
  },
  event: async ({ event, api, body }) => {
    if (!global.config.AUTO_DOWNLOAD_LINKS) return;
    if (!body) return;
    const m = body.match(LINK_RX);
    if (!m) return;
    return download(api, event.threadId, event.message, m[1], event.react);
  }
};
