module.exports = {
  config: {
    name: 'delete',
    aliases: ['del', 'uns'],
    permission: 3,
    prefix: true,
    botAdmin: false, 
    categorie: 'Moderation',
    description: 'Deletes a message by replying to it.',
    usages: ['.del']
  },

  start: async ({ api, event, args }) => {
    const { threadId, senderId, message } = event;
    
    // মেসেজ ডাটা এক্সট্রাক্ট করা (আপনার index.js এর structure অনুযায়ী)
    const quoted = message.message?.extendedTextMessage?.contextInfo || 
                   message.message?.buttonsResponseMessage?.contextInfo || 
                   message.message?.templateButtonReplyMessage?.contextInfo;

    // ১. চেক করা মেসেজে রিপ্লাই দেওয়া হয়েছে কি না
    if (!quoted) {
      return api.sendMessage(threadId, { text: '⚠️ যে মেসেজটি ডিলিট করতে চান সেটিতে রিপ্লাই দিন।' }, { quoted: message });
    }

    // ২. অন্যের মেসেজ হলে এডমিন চেক
    const isBotMessage = quoted.participant === api.user.id;
    
    if (!isBotMessage) {
      const { isSenderAdmin } = await global.isAdmin(api, threadId, senderId);
      if (!isSenderAdmin) {
        return api.sendMessage(threadId, { text: '⚠️ আপনি গ্রুপের এডমিন নন।' }, { quoted: message });
      }
    }

    // ৩. ডিলিট করা
    try {
      await api.sendMessage(threadId, {
        delete: {
          remoteJid: threadId,
          fromMe: isBotMessage,
          id: quoted.stanzaId,
          participant: quoted.participant
        }
      });
    } catch (err) {
      console.error("Delete Error:", err);
      api.sendMessage(threadId, { text: '❌ ডিলিট করতে ব্যর্থ! বটকে গ্রুপ এডমিন করুন।' }, { quoted: message });
    }
  }
};
