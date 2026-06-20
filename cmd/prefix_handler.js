module.exports = {
  config: {
    name: "prefix_handler",
    aliases: [],
    permission: 0,
    prefix: true,
    description: 'Handles custom prefix response.',
    categories: "botprefix",
    usages: [
      `${global.config.PREFIX} - Get custom message.`
    ]
  },

  event: async ({ event, api, body }) => {
    const { threadId } = event;
    const prefix = global.config.PREFIX;
    const cleanBody = body.trim().toLowerCase();

    // শুধুমাত্র প্রিফিক্স দিলে মেসেজ আসবে
    if (cleanBody === prefix) {
      return await api.sendMessage(threadId, { 
        text: `আসসালামু আলাইকুম! আমি ইমন বট। আমার সব কমান্ড দেখতে ${prefix}help ব্যবহার করুন।` 
      });
    }
  }
};
