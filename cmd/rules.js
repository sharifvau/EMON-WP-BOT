const dataFile = "grpRules.json";

module.exports = {
  config: {
    name: "rules",
    aliases: ["grouprules", "grules"],
    permission: 0,
    prefix: true,
    categorie: "Grouo",
    credit: "EMON HAWLADAR",
    description: "Shows or sets group rules.",
    usages: [
      `.rules - Shows current group rules.`,
      `.rules set - Sets new rules (admins only).`,
      `.rules remove - Remove group rules (admins only).`,
    ],
  },

  start: async ({ event, api, args }) => {
    const { threadId, isGroup, message, senderId } = event;
    const { isSenderAdmin } = await global.isAdmin(api, threadId, senderId);

    if (!isGroup) {
      return api.sendMessage(threadId, { text: "⚠️ This command can only be used in a group." });
    }

    let rulesData = (await global.data.get(dataFile)) || {};

    // ১. রুলস দেখা
    if (!args[0]) {
      const groupRules = rulesData[threadId];
      return api.sendMessage(threadId, {
        text: `📜 *Group Rules*\n────────────────────\n${groupRules || "⚠️ No rules set yet."}`
      }, { quoted: message });
    }

    // ২. রুলস রিমুভ করা
    if (args[0].toLowerCase() === "remove") {
      if (!isSenderAdmin) return api.sendMessage(threadId, { text: "❌ Only admins can remove rules." }, { quoted: message });
      delete rulesData[threadId];
      await global.data.set(dataFile, rulesData);
      return api.sendMessage(threadId, { text: "🗑️ Group rules removed successfully." }, { quoted: message });
    }

    // ৩. রুলস সেট করা
    if (args[0].toLowerCase() === "set") {
      if (!isSenderAdmin) return api.sendMessage(threadId, { text: "❌ Only admins can set rules." }, { quoted: message });

      const sentMsg = await api.sendMessage(threadId, { text: "✏️ Please reply to this message with the rules you want to set for the group." }, { quoted: message });

      // গ্লোবাল হ্যান্ডলারে পুশ করা
      global.client.handleReply.push({
        type: "rulesSet",
        name: "rules",
        messageID: sentMsg.key.id,
        author: senderId,
      });
    }
  },

  handleReply: async ({ api, event, handleReply }) => {
    const { threadId, senderId, body, message } = event;

    if (senderId !== handleReply.author) return;

    let rulesData = (await global.data.get(dataFile)) || {};

    if (handleReply.type === "rulesSet") {
      const newRules = body.trim();
      if (!newRules) return api.sendMessage(threadId, { text: "❌ You didn't type any rules." }, { quoted: message });

      rulesData[threadId] = newRules;
      await global.data.set(dataFile, rulesData);

      await api.sendMessage(threadId, { text: `✅ Group rules updated successfully!\n\n${newRules}` }, { quoted: message });

      // হ্যান্ডলার থেকে রিমুভ করা
      global.client.handleReply = global.client.handleReply.filter(h => h.messageID !== handleReply.messageID);
    }
  },
};
