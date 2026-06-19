module.exports = {
  config: { 
    name: "ban", 
    permission: 2, // শুধুমাত্র ওনারের জন্য
    prefix: true, 
    categorie: "Owner", 
    description: "Ban a user." 
  },
  start: async ({ api, event, args }) => {
    // মেনশন বা নাম্বার থেকে আইডি বের করা
    const target = args[0]?.replace(/[^0-9]/g, "");
    if (!target) return api.sendMessage(event.threadId, { text: "⚠️ দয়া করে একটি নাম্বার দিন বা মেনশন করুন।" });

    if (global.settings.bannedUsers.includes(target)) {
      return api.sendMessage(event.threadId, { text: "❌ এই ইউজার আগেই ব্যান করা হয়েছে।" });
    }

    global.settings.bannedUsers.push(target);
    global.saveSettings();
    api.sendMessage(event.threadId, { text: `✅ ইউজার ${target}-কে ব্যান করা হয়েছে। এখন থেকে সে কোনো কমান্ড চালাতে পারবে না।` });
  }
};
