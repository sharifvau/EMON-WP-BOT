const axios = require("axios");

module.exports = {
  config: { 
    name: "bot", 
    aliases: ["sim", "chat"], 
    permission: 0, 
    prefix: false, 
    cooldowns: 3, 
    categorie: "AI", 
    description: "Random chat replies.", 
    credit: "EMON HAWLADAR" 
  },

  // API ফেচ করার জন্য একটি ছোট ফাংশন
  getApiUrl: async () => {
    try {
      const { data } = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json");
      return data.api;
    } catch {
      return "https://nayan-video-downloader.vercel.app"; // ব্যাকআপ লিংক
    }
  },

  start: async function ({ api, event, args }) {
    const senderNum = event.senderId.split("@")[0];

    // ব্যান চেক (ব্যান ইউজার ব্লক করার জন্য)
    if (global.settings.bannedUsers.includes(senderNum)) return;

    const q = args.join(" ");
    
    // কোনো টেক্সট না থাকলে গ্রিটিংস
    if (!q) {
      const arr = ["হ্যাঁ বলো 😊", "কি বলবা শুনি 😏", "জানি তুমি বোর হইছো 😴", "EMON BOT তোমার সেবায় ✨", "Hmm?"];
      const sent = await api.sendMessage(event.threadId, { text: arr[Math.floor(Math.random() * arr.length)] }, { quoted: event.message });
      global.client.handleReply.push({ name: this.config.name, messageID: sent.key.id, author: event.senderId });
      return;
    }

    try {
      const baseUrl = await this.getApiUrl();
      const r = await axios.get(`${baseUrl}/sim?type=ask&ask=${encodeURIComponent(q)}&number=${senderNum}`, { timeout: 30000 });
      const text = r.data?.data?.msg || "🤖 ...";
      
      const sent = await api.sendMessage(event.threadId, { text }, { quoted: event.message });
      global.client.handleReply.push({ name: this.config.name, messageID: sent.key.id, author: event.senderId });
    } catch { 
      api.sendMessage(event.threadId, { text: "❌ Sim API unavailable." }); 
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderId !== handleReply.author || !event.body) return;
    return this.start({ api, event, args: event.body.split(/\s+/) });
  }
};
