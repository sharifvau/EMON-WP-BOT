module.exports = {
  config: { 
    name: "id", 
    aliases: ["myid", "jid"], 
    permission: 0, 
    prefix: false, 
    categorie: "Tools", 
    description: "Show ID of yourself, mentioned user, or replied user.", 
    credit: "EMON HAWLADAR" 
  },

  start: async ({ api, event }) => {
    const { threadId, senderId, message } = event;
    let targetId = senderId;

    // ১. যদি কাউকে রিপ্লাই করা হয়
    if (message.extendedTextMessage?.contextInfo?.participant) {
      targetId = message.extendedTextMessage.contextInfo.participant;
    } 
    // ২. যদি কাউকে মেনশন করা হয়
    else if (message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
      targetId = message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    const userId = targetId.split("@")[0];
    const isBot = targetId.includes(api.user?.id?.split(":")[0]);

    const response = `👤 ${isBot ? "Bot" : "User"} ID: ${userId}\n💬 Chat ID: ${threadId}`;

    await api.sendMessage(threadId, { text: response }, { quoted: message });
  }
};
