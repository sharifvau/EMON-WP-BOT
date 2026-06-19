const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");
const ffmpeg = require("fluent-ffmpeg");

async function downloadAndConvertToMp3(url, filePath) {
  return new Promise((resolve, reject) => {
    const tempFile = filePath.replace(".mp3", ".tmp");
    axios({ method: "get", url, responseType: "stream" })
      .then((response) => {
        const writer = fs.createWriteStream(tempFile);
        response.data.pipe(writer);
        writer.on("finish", () => {
          ffmpeg(tempFile)
            .toFormat("mp3")
            .on("end", () => {
              if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
              resolve(filePath);
            })
            .on("error", (err) => {
              if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
              reject(err);
            })
            .save(filePath);
        });
        writer.on("error", reject);
      })
      .catch(reject);
  });
}

module.exports = {
  config: {
    name: "song",
    aliases: ["music"],
    permission: 0,
    prefix: true,
    description: "Search and download songs from YouTube.",
    category: "Media",
  },

  start: async function ({ api, event, args }) {
    const { threadId, message } = event;
    const keyword = args.join(" ");

    if (!keyword) return api.sendMessage(threadId, { text: "⚠️ Please provide a keyword. Example: song <keyword>" }, { quoted: message });

    const results = await Youtube.GetListByKeyword(keyword, false, 6);
    if (!results.items.length) return api.sendMessage(threadId, { text: "❌ No results found." }, { quoted: message });

    const links = results.items.map((item) => item.id);
    const titles = results.items.map((item, index) => `${index + 1}. ${item.title}`);

    const sentMessage = await api.sendMessage(threadId, { 
      text: `🔎 Found ${links.length} results:\n\n${titles.join("\n")}\n\nReply with a number (1-${links.length}).` 
    }, { quoted: message });

    global.client.handleReply.push({
      name: this.config.name,
      messageID: sentMessage.key.id,
      author: event.senderId,
      links,
    });
  },

  handleReply: async function ({ api, event, handleReply }) {
    const { threadId, senderId, body, message } = event;
    if (senderId !== handleReply.author) return;

    const selectedIndex = parseInt(body, 10) - 1;
    if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= handleReply.links.length) {
      return api.sendMessage(threadId, { text: "❌ Invalid selection." }, { quoted: message });
    }

    const loadingMsg = await api.sendMessage(threadId, { text: "🎧 Downloading & converting to MP3..." });

    try {
      const selectedLink = `https://www.youtube.com/watch?v=${handleReply.links[selectedIndex]}`;
      const data = await nayan.ytdown(selectedLink);

      // এরর প্রিভেনশন: ডেটা চেক করা হচ্ছে
      if (!data?.data?.audio) {
        throw new Error("API failed to provide audio link.");
      }

      const audioUrl = data.data.audio;
      const title = data.data.title || "Unknown Title";
      const filePath = path.join(__dirname, "cache", `song_${Date.now()}.mp3`);

      await downloadAndConvertToMp3(audioUrl, filePath);

      await api.sendMessage(threadId, {
        audio: { url: filePath },
        mimetype: "audio/mpeg",
        fileName: `${title}.mp3`
      }, { quoted: message });

      // কাজ শেষে ফাইল ডিলিট
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      // লোডিং মেসেজ ডিলিট
      try { await api.sendMessage(threadId, { delete: { remoteJid: threadId, fromMe: false, id: loadingMsg.key.id, participant: senderId } }); } catch {}

    } catch (error) {
      console.error("Song Error:", error);
      api.sendMessage(threadId, { text: "❌ Failed to process the song. The API might be down or video is restricted." }, { quoted: message });
    }
  },
};
