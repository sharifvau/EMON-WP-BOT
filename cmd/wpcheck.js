module.exports = {
  config: {
    name: 'wpcheck',
    aliases: ['checkwp', 'iswp', 'wck'],
    permission: 0,
    prefix: true,
    description: 'Check if number(s) have WhatsApp accounts.',
    categories: 'Utility',
    usages: ['.wpcheck 8801615298449 8801754168148'],
    credit: 'Developed by Mohammad Nayan | Modified by EMon HAWLADAR'
  },

  start: async ({ api, args, event }) => {
    const { threadId } = event;
    const numbers = args.filter(Boolean);

    if (!numbers.length) {
      return api.sendMessage(threadId, { 
        text: '❌ *Usage Error!*\nPlease provide phone numbers separated by spaces.\nExample: `.wpcheck 8801615298449 8801754168148`' 
      });
    }

    await api.sendMessage(threadId, { text: `⏳ *Checking ${numbers.length} number(s)...*` });

    const results = await Promise.all(numbers.map(async (num) => {
      // নাম্বার ফরম্যাট ঠিক করা
      const cleanNum = num.replace(/[^0-9]/g, '');
      const jid = `${cleanNum}@s.whatsapp.net`;
      
      try {
        const [result] = await api.onWhatsApp(jid);
        if (result && result.exists) {
          // যদি হোয়াটসঅ্যাপ থাকে, প্রোফাইল পিকচার লিংক পাওয়ার চেষ্টা করা
          let pp = "N/A";
          try { pp = await api.profilePictureUrl(jid, 'image'); } catch {}
          return { num: cleanNum, exists: true, pp };
        }
        return { num: cleanNum, exists: false };
      } catch {
        return { num: cleanNum, exists: false };
      }
    }));

    // রেজাল্ট সাজানো
    const iswp = results.filter(r => r.exists);
    const nknwp = results.filter(r => !r.exists);

    let resultText = `🔍 *WhatsApp Check Results*\n────────────────────\n`;

    if (iswp.length > 0) {
      resultText += `✅ *Registered (${iswp.length}):*\n`;
      iswp.forEach(r => {
        resultText += `• *${r.num}* ${r.pp !== "N/A" ? '(Has PP)' : ''}\n`;
      });
      resultText += `\n`;
    }

    if (nknwp.length > 0) {
      resultText += `❌ *Not Registered (${nknwp.length}):*\n`;
      nknwp.forEach(r => {
        resultText += `• ${r.num}\n`;
      });
    }

    api.sendMessage(threadId, { text: resultText.trim() });
  }
};
