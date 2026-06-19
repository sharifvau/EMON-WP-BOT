const axios = require('axios');

module.exports = {
  config: {
    name: "teach",
    aliases: ["tc", "simtc"],
    permission: 0,
    prefix: true,
    categorie: "Utility",
    description: "Teach the bot to respond to specific messages.",
    usages: ["teach [ask] = [answer]"],
    credit: "Developed by Mohammad Nayan | Refined by EMon HAWLADAR"
  },

  start: async ({ event, api, args }) => {
    const { threadId, message } = event;
    const input = args.join(' ');

    // ১. ইনপুট চেক করা
    if (!input || !input.includes('=')) {
      return api.sendMessage(threadId, { 
        text: '❌ *Usage Error!*\nFormat: `.teach [ask] = [answer]`\nExample: `.teach hello = hi`' 
      }, { quoted: message });
    }

    // ২. Ask এবং Answer আলাদা করা
    const [ask, ans] = input.split('=').map(str => str.trim());
    if (!ask || !ans) {
      return api.sendMessage(threadId, { text: '⚠️ Invalid format! Please ensure you provide both [ask] and [answer].' }, { quoted: message });
    }

    try {
      // ৩. API URL ফেচ করা
      const { data: apiData } = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json');
      const teachBaseUrl = apiData.sim;

      // ৪. টিচিং রিকোয়েস্ট পাঠানো
      const resUrl = `${teachBaseUrl}/sim?type=teach&ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`;
      const res = await axios.get(resUrl);

      // ৫. সফল মেসেজ
      await api.sendMessage(threadId, { 
        text: `✅ *Successfully Taught!*\n\n• *Ask:* ${ask}\n• *Ans:* ${ans}\n\n🤖 The bot will now respond to this.` 
      }, { quoted: message });

    } catch (error) {
      console.error('Teach Cmd Error:', error);
      api.sendMessage(threadId, { text: '❌ Error: Failed to store the response in the database. Please try again.' }, { quoted: message });
    }
  }
};
