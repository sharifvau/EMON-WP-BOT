const axios = require("axios");

async function askAI(prompt, system) {
  const cfg = global.config.AI;
  const key = process.env.LOVABLE_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) throw new Error("No AI API key set (LOVABLE_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY).");
  const url = cfg.provider === "lovable"
    ? "https://ai.gateway.lovable.dev/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions";
  const headers = cfg.provider === "lovable"
    ? { "Content-Type": "application/json", "Lovable-API-Key": key }
    : { "Content-Type": "application/json", "Authorization": `Bearer ${key}` };
  const { data } = await axios.post(url, {
    model: cfg.model,
    messages: [{ role: "system", content: system || cfg.personality }, { role: "user", content: prompt }]
  }, { headers, timeout: 60000 });
  return data.choices?.[0]?.message?.content || "🤖 (no reply)";
}
global.askAI = askAI;

module.exports = {
  config: { name: "ai", aliases: ["gpt","gemini","ask"], permission: 0, prefix: false, cooldowns: 4, categorie: "AI", description: "Chat with EMON AI.", credit: "EMON HAWLADAR" },
  start: async function ({ api, event, args }) {
    const q = args.join(" ");
    if (!q) return api.sendMessage(event.threadId, { text: "Ask me anything! Usage: ai <question>" }, { quoted: event.message });
    await event.react("🤔");
    try {
      const personality = global.settings.groupPersonality?.[event.threadId] || global.config.AI.personality;
      const reply = await askAI(q, personality);
      await event.react("✅");
      const sent = await api.sendMessage(event.threadId, { text: `🤖 ${reply}\n\n${global.config.FOOTER}` }, { quoted: event.message });
      global.client.handleReply.push({ name: this.config.name, messageID: sent.key.id, author: event.senderId });
    } catch (e) { await event.react("❌"); api.sendMessage(event.threadId, { text: "❌ AI error: " + e.message }, { quoted: event.message }); }
  },
  handleReply: async function ({ api, event, handleReply }) {
    if (event.senderId !== handleReply.author || !event.body) return;
    try {
      const personality = global.settings.groupPersonality?.[event.threadId] || global.config.AI.personality;
      const r = await askAI(event.body, personality);
      const sent = await api.sendMessage(event.threadId, { text: `🤖 ${r}` }, { quoted: event.message });
      global.client.handleReply.push({ name: this.config.name, messageID: sent.key.id, author: event.senderId });
    } catch (e) { api.sendMessage(event.threadId, { text: "❌ " + e.message }); }
  }
};
