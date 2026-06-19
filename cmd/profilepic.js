module.exports = {
  config: {
    name: 'profilepic',
    aliases: ['pp', 'avatar'],
    permission: 0,
    prefix: true,
    description: 'Send the profile picture of the mentioned user or yourself.',
    categories: 'media',
    usages: ['profilepic @mention'],
    credit: 'EMON HAWLADAR',
  },

  start: async ({ event, api }) => {
    const { threadId, senderId, message } = event;
    
    // মেনশন আইডি বের করা
    let targetId = senderId;
    if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
        targetId = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    try {
      // Baileys এর মাধ্যমে প্রোফাইল পিকচার ইউআরএল নেওয়া
      const ppUrl = await api.profilePictureUrl(targetId, 'image');
      
      if (!ppUrl) {
        return api.sendMessage(threadId, { text: '⚠️ No profile picture available for this user.' });
      }

      await api.sendMessage(threadId, {
        image: { url: ppUrl },
        caption: `📸 Profile picture of: @${targetId.split('@')[0]}`,
        mentions: [targetId]
      });

    } catch (error) {
      console.error('Error fetching profile picture:', error);
      await api.sendMessage(threadId, { text: '❌ Could not retrieve the profile picture.' });
    }
  },
};
