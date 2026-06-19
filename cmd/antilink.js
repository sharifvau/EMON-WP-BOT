module.exports = {
  config: {
    name: "antilink",
    aliases: ["alink"],
    permission: 2, // ২ মানে অ্যাডমিনরাই কন্ট্রোল করতে পারবে
    prefix: true,
    categorie: "Moderation",
    description: "Block different types of links in the group.",
    credit: "EMON HAWLADAR",
    usages: ["antilink off", "antilink whatsapp", "antilink telegram", "antilink all"]
  },

  start: async ({ api, event, args }) => {
    const sub = (args[0] || "").toLowerCase();
    const map = { 
      off: "off", 
      whatsapp: "whatsappGroup", 
      whatsappchannel: "whatsappChannel", 
      telegram: "telegram", 
      all: "allLinks" 
    };

    if (!sub || !(sub in map)) {
      return api.sendMessage(event.threadId, { 
        text: "⚙️ *Antilink Configuration*\n\nUsage: .antilink [off|whatsapp|whatsappchannel|telegram|all]" 
      });
    }

    // ডাটা সেভ করার ফাংশন (আপনার গ্লোবাল সিস্টেমে)
    global.setAntilinkSetting(event.threadId, map[sub]);
    return api.sendMessage(event.threadId, { text: `✅ Antilink mode set to: *${map[sub]}*` });
  },

  event: async ({ event, api }) => {
    // যদি মেসেজ না থাকে তবে রিটার্ন
    const body = event.message?.extendedTextMessage?.text || event.message?.conversation || "";
    if (!body || event.isSenderAdmin || global.isOwner(event.senderId)) return;

    const s = global.getAntilinkSetting(event.threadId);
    if (!s || s === "off") return;

    const patterns = {
      whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/, // আরও নিখুঁত রেগুলার এক্সপ্রেশন
      whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{15,}/,
      telegram: /t\.me\/[A-Za-z0-9_]+/,
      allLinks: /https?:\/\/[^\s]+/i
    };

    if (patterns[s] && patterns[s].test(body)) {
      try {
        // মেসেজ ডিলিট করা
        await api.sendMessage(event.threadId, { 
          delete: { remoteJid: event.threadId, fromMe: false, id: event.message.key.id, participant: event.senderId } 
        });
        
        // ওয়ার্নিং মেসেজ
        await api.sendMessage(event.threadId, { 
          text: `⚠️ @${event.senderId.split("@")[0]}, এই গ্রুপে লিংক শেয়ার করা নিষেধ!`, 
          mentions: [event.senderId] 
        });
      } catch (err) {
        console.error("Antilink Error:", err);
      }
    }
  }
};
