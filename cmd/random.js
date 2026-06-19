const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "random",
    aliases: ["rndm"],
    permission: 0,
    prefix: true,
    categorie: "video",
    credit: "Developed by Mohammad Nayan | Refined by EMon HAWLADAR",
    description: "Fetches a random video or a video based on a query.",
    usages: [`.random`, `.random <query>`],
  },

  start: async ({ event, api, args }) => {
    const { threadId } = event;
    const msg = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    try {
      const { data: apiData } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
      const apiBaseURL = apiData.api;

      // ভিডিও পাঠানোর ফাংশন
      const sendVideo = async (videoUrl, caption) => {
        // ইউআরএলটি যদি অবজেক্ট হয় তবে সেটি থেকে স্ট্রিং বের করা
        const finalUrl = typeof videoUrl === 'object' ? (videoUrl.url || videoUrl[0]) : videoUrl;
        
        if (!finalUrl || typeof finalUrl !== 'string') throw new Error("Invalid URL format received");

        const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
        const writer = fs.createWriteStream(filePath);
        
        const response = await axios({ url: finalUrl, method: 'GET', responseType: 'stream' });
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        await api.sendMessage(threadId, {
          video: { stream: fs.createReadStream(filePath) },
          caption: caption
        });

        fs.unlinkSync(filePath);
      };

      if (!msg) {
        const { data: res } = await axios.get(`${apiBaseURL}/video/mixvideo`);
        await sendVideo(res.url, `${res.cp || "Random Video"}\n\nAdded By: ${res.name || "Unknown"}`);
      } else {
        const { data: res } = await axios.get(`${apiBaseURL}/random?name=${encodeURIComponent(msg)}`);
        const videoData = res.data || res;
        await sendVideo(videoData.url, `${videoData.cp || "Search Result"}\n\nAdded By: ${videoData.name || "Unknown"}`);
      }

    } catch (error) {
      console.error("Random Cmd Error:", error.message);
      api.sendMessage(threadId, { text: "❌ Error: Could not process the video. The API might be returning an invalid format." });
    }
  },
};
