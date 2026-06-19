const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "sticker",
    aliases: ["s"],
    permission: 0,
    prefix: true,
    categorie: "Tools",
    description: "Convert image to sticker.",
    credit: "EMON HAWLADAR"
  },

  start: async ({ api, event }) => {
    const { threadId, message } = event;
    const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted || !quoted.imageMessage) {
      return api.sendMessage(threadId, { text: "⚠️ Please reply to an image to convert it into a sticker." });
    }

    try {
      // ১. ছবি ডাউনলোড করা
      const buffer = await downloadMediaMessage({ message: quoted }, "buffer", {});
      
      // ২. ছবিটিকে স্টিকারে কনভার্ট করা (Sharp ব্যবহার করে)
      const stickerBuffer = await sharp(buffer)
        .resize(512, 512, { fit: "contain" })
        .webp()
        .toBuffer();

      // ৩. স্টিকার পাঠানো
      await api.sendMessage(threadId, { 
        sticker: stickerBuffer 
      }, { quoted: message });

    } catch (error) {
      console.error("Sticker Error:", error);
      api.sendMessage(threadId, { text: "❌ Failed to convert image to sticker." });
    }
  }
};
