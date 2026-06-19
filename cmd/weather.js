const axios = require("axios");
module.exports = {
  config: { name: "weather", aliases: ["wt"], permission: 0, prefix: false, cooldowns: 5, categorie: "Tools", description: "Get weather of a city.", credit: "EMON HAWLADAR" },
  start: async ({ api, event, args }) => {
    if (!args[0]) return api.sendMessage(event.threadId, { text: "Usage: weather <city>" });
    try {
      const r = await axios.get(`https://wttr.in/${encodeURIComponent(args.join(" "))}?format=j1`);
      const c = r.data.current_condition[0];
      api.sendMessage(event.threadId, { text: `🌤️ ${args.join(" ")}\nTemp: ${c.temp_C}°C (feels ${c.FeelsLikeC}°C)\nWeather: ${c.weatherDesc[0].value}\nHumidity: ${c.humidity}%\nWind: ${c.windspeedKmph} km/h` }, { quoted: event.message });
    } catch (e) { api.sendMessage(event.threadId, { text: "❌ Could not fetch weather." }); }
  }
};
