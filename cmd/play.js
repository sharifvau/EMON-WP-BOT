const fs = require("fs");
const path = require("path");
const axios = require("axios");
const nayan = require("nayan-media-downloaders");
const Youtube = require("youtube-search-api");
const ffmpeg = require("fluent-ffmpeg");

// Helper function (Top level এ রাখা হয়েছে)
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
        name: "play",
        aliases: ["ply"],
        permission: 0,
        prefix: true,
        description: "Play a song from YouTube.",
        category: "Media",
    },

    // মূল কমান্ড ফাংশন
    start: async function ({ api, event, args }) {
        const { threadId, message } = event;
        const keyword = args.join(" ");

        if (!keyword) {
            return api.sendMessage(threadId, { text: "⚠️ Please provide a song name." }, { quoted: message });
        }

        try {
            const results = await Youtube.GetListByKeyword(keyword, false, 1);
            if (!results.items.length) {
                return api.sendMessage(threadId, { text: "❌ No results found." }, { quoted: message });
            }

            const videoId = results.items[0].id;
            const title = results.items[0].title;
            const selectedLink = `https://www.youtube.com/watch?v=${videoId}`;

            const loadingMsg = await api.sendMessage(threadId, { text: `🎧 Downloading: *${title}*...` }, { quoted: message });

            const data = await nayan.ytdown(selectedLink);
            
            if (!data?.data?.audio) {
                throw new Error("Audio URL not found");
            }

            const audioUrl = data.data.audio;
            const filePath = path.join(__dirname, "cache", `play_${Date.now()}.mp3`);

            await downloadAndConvertToMp3(audioUrl, filePath);

            await api.sendMessage(threadId, {
                audio: { url: filePath },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`
            }, { quoted: message });

            // ফাইল মুছে ফেলা
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            
            // লোডিং মেসেজ ডিলিট
            try { await api.sendMessage(threadId, { delete: { remoteJid: threadId, fromMe: false, id: loadingMsg.key.id } }); } catch {}

        } catch (error) {
            console.error("❌ Play Command Error:", error);
            api.sendMessage(threadId, { text: "❌ Failed to process the song." }, { quoted: message });
        }
    }
};
