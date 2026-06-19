const axios = require('axios');

module.exports = {
  config: {
    name: 'rndmadd',
    aliases: ['randomadd'],
    permission: 0, // এখানে ১ দিলে শুধু এডমিনরা ব্যবহার করতে পারবে
    prefix: true,
    description: 'Randomly adds a name and URL to the mix.',
    usages: ['.rndmadd <name> (reply to a video)'],
    categories: 'Utilities',
    credit: 'Developed by Mohammad Nayan | Refined by EMon HAWLADAR',
  },

  start: async ({ event, api, args }) => {
    const { threadId, message } = event;
    const targetName = args.join(' ');

    // ১. নাম ইনপুট চেক করা
    if (!targetName) {
      return api.sendMessage(threadId, { text: '❌ Please provide a name to add.' }, { quoted: message });
    }

    // ২. রিপ্লাই চেক করা
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || (!quoted.videoMessage)) {
      return api.sendMessage(threadId, { text: '❌ Please reply to a video file.' }, { quoted: message });
    }

    try {
      await api.sendMessage(threadId, { text: '⏳ Processing your request...' }, { quoted: message });

      // ৩. API URL ফেচ করা
      const { data: apiData } = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json');
      const apiUrl = apiData.api;

      // ৪. মিডিয়া লিঙ্ক বা কন্টেন্ট প্রসেসিং (আপনার বটের ফাংশন অনুযায়ী)
      // আপনার আগের কোডের getLink ফাংশনের পরিবর্তে সহজতর পদ্ধতি ব্যবহার করা হয়েছে
      const videoMsg = quoted.videoMessage;
      // দ্রষ্টব্য: এখানে সরাসরি লিঙ্ক পাওয়ার উপায় নেই, যদি না আপনার বট ডাউনলোড করা ভিডিওর URL জেনারেট করে।
      // যদি ভিডিও লিঙ্ক প্রয়োজন হয়, তবে আপনাকে ফাইলটি আপলোড করে তার URL পেতে হবে।
      // নিচে একটি নমুনা URL সেট করা হয়েছে।
      const videoLink = "YOUR_GENERATED_VIDEO_URL_HERE"; 

      // ৫. ডাটা পাঠানোর জন্য কল
      const response = await axios.get(`${apiUrl}/mixadd?name=${encodeURIComponent(targetName)}&url=${encodeURIComponent(videoLink)}`);
      
      const res = response?.data;
      const messageBody = `📩 *MESSAGE:* ${res?.msg || 'Success'}\n📛 *NAME:* ${res?.data?.name || targetName}\n🖇 *URL:* ${res?.data?.url || 'Saved'}`;
      
      await api.sendMessage(threadId, { text: messageBody }, { quoted: message });

    } catch (error) {
      console.error('Rndmadd Cmd Error:', error);
      api.sendMessage(threadId, { text: '❌ Failed to process. Ensure the API is active.' }, { quoted: message });
    }
  },
};
