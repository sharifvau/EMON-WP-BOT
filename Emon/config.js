// ╔══════════════════════════════════════════════╗
// ║    EMON BOT — Main Configuration File        ║
// ║    Owner: EMON HAWLADAR                      ║
// ║    Number: 8801309991724                     ║
// ║    Email : emonhawladar311@gmail.com         ║
// ╚══════════════════════════════════════════════╝
module.exports = {
  BOT_NAME: "EMON BOT",
  PREFIX: ".",
  ALLOW_NO_PREFIX: true,        // commands work without prefix too
  REPLY_TO_INBOX: true,         // reply in private chat
  REPLY_TO_SELF: true,          // bot reacts to its own messages
  AUTO_DOWNLOAD_LINKS: true,    // auto downloader on any video link
  AUTO_RESTART: false,
  AUTO_READ: false,
  AUTO_TYPING: false,
  AUTO_UPDATE: true,
  TIMEZONE: "Asia/Dhaka",
  LANGUAGE: "en",
  // ── OWNERS (multi-owner) ──
  OWNERS: [
    "8801309991724",
    "",
    ""
  ],
  OWNER_NAME: "EMON HAWLADAR",
  OWNER_EMAIL: "emonhawladar311@gmail.com",

  // ── LOGIN ──
  loginMode: "pair",              // "qr" | "pair"
  pairingNumber: "601157471700",

  // ── AI ──
  AI: {
    enabled: true,
    provider: "lovable",        // lovable | openai | gemini
    model: "google/gemini-2.5-flash",
    personality: "You are EMON BOT, a helpful WhatsApp assistant created by EMON HAWLADAR."
  },

  // ── BRANDING ──
  CREDITS: "All credit — EMON HAWLADAR",
  FOOTER: "— EMON BOT —"
};
