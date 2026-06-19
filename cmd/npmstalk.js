const { npmStalk } = require('api-qasim');

module.exports = {
  config: {
    name: "npmstalk",
    aliases: ["npmstlk"],
    permission: 0,
    prefix: true,
    categorie: "Stalk",
    description: "Get details about an NPM package",
    usages: ["npmstalk <package-name>"],
    credit: "EMON HAWLADAR"
  },

  start: async ({ api, event, args }) => {
    const { threadId } = event;

    if (!args[0]) {
      return api.sendMessage(threadId, { text: "✳️ Please provide an NPM package name.\n\nExample:\n.npmstalk axios" });
    }

    try {
      const res = await npmStalk(args[0]);
      if (!res || !res.result) throw new Error();

      const data = res.result;
      const authorName = (typeof data.author === 'object') ? data.author.name : (data.author || 'Unknown');
      const versionCount = data.versions ? Object.keys(data.versions).length : 0;

      let te = `┌──「 *NPM PACKAGE INFO* 」\n`;
      te += `▢ *🔖Name:* ${data.name}\n`;
      te += `▢ *🔖Creator:* ${authorName}\n`;
      te += `▢ *👥Total Versions:* ${versionCount}\n`;
      te += `▢ *📌Description:* ${data.description || 'No description'}\n`;
      te += `▢ *🧩Repository:* ${data.repository?.url || 'No repository available'}\n`;
      te += `▢ *🌍Homepage:* ${data.homepage || 'No homepage available'}\n`;
      te += `▢ *🏷️Latest:* ${data['dist-tags']?.latest || 'N/A'}\n`;
      te += `▢ *🔗Link:* https://npmjs.com/package/${data.name}\n`;
      te += `└────────────`;

      await api.sendMessage(threadId, { text: te });
    } catch (error) {
      await api.sendMessage(threadId, { text: "✳️ Error: Package not found or API issue." });
    }
  }
};
