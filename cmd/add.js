module.exports = {
  config: {
    name: "add",
    permission: 3,
    prefix: true,
    botAdmin: false,
    categorie: "Group",
    description: "Add user by number.",
    credit: "EMON HAWLADAR"
  },

  start: async ({ api, event, args }) => {

    const num = (args[0] || "").replace(/\D/g, "");

    if (!num) {
      return api.sendMessage(
        event.threadId,
        { text: "⚠️ Usage: .add 60123456789" }
      );
    }

    try {
      await api.groupParticipantsUpdate(
        event.threadId,
        [`${num}@s.whatsapp.net`],
        "add"
      );

      return api.sendMessage(
        event.threadId,
        { text: `✅ Successfully added ${num}` }
      );

    } catch (err) {
      console.error(err);

      return api.sendMessage(
        event.threadId,
        { text: `❌ ${err.message}` }
      );
    }
  }
};