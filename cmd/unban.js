module.exports = {
  config: { name: "unban", permission: 2, prefix: true, categorie: "Owner", description: "Unban a user." },
  start: async ({ api, event, args }) => {
    const target = args[0]?.replace(/[^0-9]/g, "");
    if (!target) return api.sendMessage(event.threadId, { text: "⚠️ নাম্বার দিন।" });

    const index = global.settings.bannedUsers.indexOf(target);
    if (index > -1) {
      global.settings.bannedUsers.splice(index, 1);
      global.saveSettings();
      api.sendMessage(event.threadId, { text: `✅ ইউজার ${target}-কে আনব্যান করা হয়েছে।` });
    } else {
      api.sendMessage(event.threadId, { text: "❌ ইউজার ব্যান লিস্টে নেই।" });
    }
  }
};
