const moment = require("moment-timezone");
module.exports = {
  config: { name: "time", aliases: ["clock","date"], permission: 0, prefix: false, categorie: "Tools", description: "Current time.", credit: "EMON HAWLADAR" },
  start: async ({ api, event }) => {
    const t = moment().tz(global.config.TIMEZONE);
    api.sendMessage(event.threadId, { text: `🕒 ${t.format("dddd, DD MMM YYYY, hh:mm:ss A z")}` }, { quoted: event.message });
  }
};
