const fs = require("fs"), path = require("path"), axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");

module.exports = {
  config: { name: "video", aliases: ["v","yt"], permission: 0, prefix: false, cooldowns: 5, categorie: "Media", description: "Search & download YouTube video.", credit: "EMON HAWLADAR" },
  start: async function ({ api, event, args }) {
    if (!args.length) return api.sendMessage(event.threadId, { text: "Usage: video <keyword>" }, { quoted: event.message });
    const r = await Youtube.GetListByKeyword(args.join(" "), false, 6);
    const links = r.items.map(i => i.id);
    const titles = r.items.map((i,n) => `${n+1}. ${i.title} (${i.length?.simpleText||"?"})`);
    const sent = await api.sendMessage(event.threadId, { text: `🔎 Reply 1-${links.length}:\n\n${titles.join("\n")}` }, { quoted: event.message });
    global.client.handleReply.push({ name: this.config.name, messageID: sent.key.id, author: event.senderId, links });
  },
  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderId !== handleReply.author) return;
    const i = parseInt(event.body) - 1;
    if (isNaN(i) || !handleReply.links[i]) return api.sendMessage(event.threadId, { text: "❌ Invalid choice." });
    const link = `https://www.youtube.com/watch?v=${handleReply.links[i]}`;
    await event.react("⏳");
    try {
      const d = await nayan.ytdown(link);
      const file = path.join(__dirname, "cache", `v_${Date.now()}.mp4`);
      const res = await axios({ url: d.data.video, method:"GET", responseType:"stream" });
      await new Promise((ok,no)=>{ const w=fs.createWriteStream(file); res.data.pipe(w); w.on("finish",ok); w.on("error",no); });
      await event.react("✅");
      await api.sendMessage(event.threadId, { video: fs.readFileSync(file), caption: `🎬 ${d.data.title}` }, { quoted: event.message });
      fs.unlink(file, ()=>{});
    } catch (e) { await event.react("❌"); api.sendMessage(event.threadId, { text: "❌ " + e.message }); }
  }
};
