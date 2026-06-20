module.exports = {
  config: {
    name: 'uid',
    aliases: ['id', 'userid'],
    permission: 0,
    prefix: true,
    categorie: 'tools',
    credit: 'EMON HAWLADAR',
    usages: [
      `${global.config.PREFIX}uid - Get your UID.`,
      `${global.config.PREFIX}uid @mention - Get UID of mentioned user.`,
      `${global.config.PREFIX}uid (reply) - Get UID of replied user.`
    ]
  },

  start: async ({ event, api }) => {
    try {
      let targetIds = [];

      // ১. যদি মেনশন থাকে
      if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetIds = Object.keys(event.mentions);
      }
      // ২. যদি মেসেজ রিপ্লাই দেওয়া হয়
      else if (event.messageReply && event.messageReply.senderId) {
        targetIds = [event.messageReply.senderId];
      }
      // ৩. ডিফল্ট নিজের আইডি
      else {
        targetIds = [event.senderId];
      }

      // রেসপন্স তৈরি
      let response = targetIds.map(id => {
        return `📌 UID of @${id.split('@')[0]}: ${id.split('@')[0]}`;
      }).join("\n");

      await api.sendMessage(event.threadId, {
        text: response,
        mentions: targetIds
      }, { quoted: event.message });

    } catch (error) {
      console.error("UID Command Error:", error);
      await api.sendMessage(event.threadId, { text: '⚠️ An error occurred while getting UID.' }, { quoted: event.message });
    }
  }
};
