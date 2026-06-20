module.exports = {
  config: {
    name: "${global.config.PREFIX}",
    aliases: [],
    permission: 0,
    prefix: true,
    description: 'Handles custom prefix responses.',
    categories: "utility",
    usages: [
      `${global.config.PREFIX} - Get custom message.`,
      `${global.config.PREFIX}help - Show help menu.`
    ]
  },

  event: async ({ event, api, body }) => {
    const { threadId } = event;
    const prefix = global.config.PREFIX;
    const cleanBody = body.trim().toLowerCase();

    // ১. ইউজার যদি শুধুমাত্র প্রিফিক্স লেখে (যেমন: .)
    if (cleanBody === prefix) {
      return await api.sendMessage(threadId, { 
        text: "আসসালামু আলাইকুম! আমি ইমোন এআই। আমাকে কোনো কিছু জিজ্ঞাসা করতে প্রিফিক্স ব্যবহার করুন।" 
      });
    }

    // ২. ইউজার যদি প্রিফিক্স + help লেখে (যেমন: .help)
    if (cleanBody === `${prefix}help`) {
      return await api.sendMessage(threadId, {
        text: `🤖 *EMON AI HELP MENU*\n\nকমান্ড লিস্ট:\n১. '${prefix}help' - হেল্প মেনু দেখতে।\n\n- Powered by EMon-BHai`
      });
    }
  }
};
