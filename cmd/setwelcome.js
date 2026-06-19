module.exports = {
  config: { 
    name: "setwelcome", 
    permission: 3, 
    prefix: true, 
    description: "Set custom welcome text. Use @name for mention.", 
    credit: "EMON HAWLADAR" 
  },
  start: async ({ api, event, args }) => {
    const { threadId } = event;
    const text = args.join(" ");
    
    if (!text) return api.sendMessage(threadId, { text: "⚠️ ব্যবহার: setwelcome <text>. @name ব্যবহার করুন ইউজারের নামের জন্য।" });
    
    if (!global.settings.welcomeText) global.settings.welcomeText = {};
    global.settings.welcomeText[threadId] = text;
    global.saveSettings();
    
    api.sendMessage(threadId, { text: "✅ ওয়েলকাম মেসেজ আপডেট করা হয়েছে!" });
  }
};
