module.exports = {
  config: { 
    name: "welcome", 
    permission: 3, 
    prefix: true, 
    categorie: "Moderation", 
    description: "Toggle welcome message.", 
    credit: "EMON HAWLADAR" 
  },
  
  start: async ({ api, event, args }) => {
    const { threadId } = event;
    const s = (args[0] || "").toLowerCase();
    
    // নিশ্চিত করুন যে settings এ welcome অবজেক্টটি আছে
    if (!global.settings.welcome) global.settings.welcome = {};

    if (s === "on") { 
      global.settings.welcome[threadId] = true; 
      global.saveSettings(); 
      return api.sendMessage(threadId, { text: "✅ Welcome message enabled for this group." }); 
    }
    
    if (s === "off") { 
      delete global.settings.welcome[threadId]; 
      global.saveSettings(); 
      return api.sendMessage(threadId, { text: "❌ Welcome message disabled for this group." }); 
    }
    
    api.sendMessage(threadId, { text: "Usage: welcome on | welcome off" });
  }
};
