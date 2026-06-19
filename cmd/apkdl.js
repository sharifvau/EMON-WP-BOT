const { apksearch } = require('api-qasim');
const axios = require('axios');

module.exports = {
  config: {
    name: "apkdl",
    aliases: ["apk", "an1apk", "appdl", "app"],
    permission: 0,
    prefix: true,
    categorie: "Download",
    description: "Search APKs and download by reply",
    usages: ["apkdl <apk_name>"],
    credit: "EMON HAWLADAR"
  },

  start: async ({ api, event, args }) => {
    const { threadId, message } = event;
    const query = args.join(' ').trim();

    if (!query) {
      return api.sendMessage(threadId, { text: '*Please provide an APK name.*\nExample: .apkdl Telegram' });
    }

    try {
      await api.sendMessage(threadId, { text: '🔎 Searching for APKs...' });
      const res = await apksearch(query);
      
      if (!res?.data || !Array.isArray(res.data) || res.data.length === 0) {
        return api.sendMessage(threadId, { text: '❌ No APKs found.' });
      }

      const results = res.data;
      const first = results[0];
      let caption = `📱 *APK Search Results for:* *${query}*\n\n`;
      caption += `↩️ *Reply with a number to download*\n\n`;
      
      results.forEach((item, i) => {
        caption += `*${i + 1}.* ${item.judul}\n👨‍💻 Developer: ${item.dev}\n⭐ Rating: ${item.rating}\n\n`;
      });

      const sentMsg = await api.sendMessage(threadId, { image: { url: first.thumb }, caption: caption });
      
      // এখানে মেসেজ লিসেনার বসানো হয়েছে (আপনার বটের ইভেন্ট সিস্টেম অনুযায়ী)
      global.client.onReply(sentMsg.key.id, async (replyEvent) => {
        const choice = parseInt(replyEvent.message.conversation || replyEvent.message.extendedTextMessage?.text, 10);
        
        if (isNaN(choice) || choice < 1 || choice > results.length) {
          return api.sendMessage(threadId, { text: `❌ Invalid choice. Pick 1-${results.length}.` });
        }

        const selected = results[choice - 1];
        await api.sendMessage(threadId, { text: `⬇️ Downloading *${selected.judul}*...\n⏱ Please wait...` });

        const apiUrl = `https://discardapi.dpdns.org/api/apk/dl/android1?apikey=guru&url=${encodeURIComponent(selected.link)}`;
        const dlRes = await axios.get(apiUrl);
        const apk = dlRes.data?.result;

        if (!apk?.url) {
          return api.sendMessage(threadId, { text: '❌ Failed to get APK download link.' });
        }

        const safeName = apk.name.replace(/[^\w.-]/g, '_');
        const apkCaption = `📦 *APK Downloaded*\n\n📛 Name: ${apk.name}\n⭐ Rating: ${apk.rating}\n📦 Size: ${apk.size}\n📱 Android: ${apk.requirement}\n\n📝 Description:\n${apk.description}`;
        
        await api.sendMessage(threadId, { 
          document: { url: apk.url }, 
          fileName: `${safeName}.apk`, 
          mimetype: 'application/vnd.android.package-archive', 
          caption: apkCaption 
        });
      });

    } catch (err) {
      console.error('❌ Android Plugin Error:', err);
      await api.sendMessage(threadId, { text: '❌ Failed to process APK request.' });
    }
  }
};
