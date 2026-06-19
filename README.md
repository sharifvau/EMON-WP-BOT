🚀 EMON BOT — Professional WhatsApp Multi-Device Bot

<p align="center">
  <img src="https://i.imgur.com/placeholder.png" width="180">
</p><h1 align="center">⚡ EMON BOT ⚡</h1><p align="center">
Professional WhatsApp Multi-Device Bot powered by Baileys
</p>---

👑 Owner Information

- Owner: EMON HAWLADAR
- WhatsApp: +8801309991724
- Email: emonhawladar311@gmail.com

«Built and maintained by EMON HAWLADAR»

---

✨ Main Features

🤖 WhatsApp Multi-Device

- QR Login
- Pairing Code Login
- Auto Reconnect
- Auto Session Recovery

🚀 24/7 Stability

- Auto Restart on Crash
- Auto Restart on Disconnect
- PM2 Support
- Start Wrapper Included

🎬 Auto Downloader

Supports:

- Facebook
- Instagram
- TikTok
- YouTube
- Twitter/X
- Pinterest

Just send a link and download instantly.

🤖 AI Integration

Supports:

- Lovable AI
- OpenAI GPT
- Gemini AI

Per-group personality system included.

👮 Group Management

- Kick
- Add
- Promote
- Demote
- Tagall
- Hidetag
- Group Link
- Group Rename
- Anti-Link
- Auto Warn System

🎭 Entertainment

70+ Commands Included:

- ship
- gay
- hot
- iq
- joke
- dice
- rps
- 8ball
- truth
- dare

📢 Broadcast System

Send messages to all groups instantly.

💾 Database

- Auto Save Every 30 Seconds
- JSON Based
- No Mongo Required

---

🔐 Session Generator

Generate your WhatsApp session using:

🌐 https://emon-bot-session-generator.onrender.com

Supported Methods

✅ QR Code Login

✅ Pairing Code Login

How To Use

1. Open the website
2. Choose QR or Pair Mode
3. Connect WhatsApp
4. Download generated "creds.json"
5. Upload "creds.json" into:

Emon/session/

6. Start bot

node start.js

Bot will connect automatically.

---

📂 Project Structure

EmonBot/
│
├── Emon/
│   ├── config.js
│   ├── settings.json
│   ├── database.json
│   ├── logs/
│   └── session/
│
├── cmd/
│
├── index.js
├── start.js
├── package.json
│
└── README.md

---

⚙️ Installation

git clone https://replit.com/@sharifvau4/EMON-WP-BOT

cd EMON-BOT

npm install

node start.js

Or use PM2:

pm2 start start.js --name EMON-BOT

---

🔑 Login Mode

Edit:

Emon/config.js

QR Login

loginMode: "qr"

Pair Login

loginMode: "pair"

pairingNumber: "8801XXXXXXXXX"

---

🛡️ Permission System

Permission| Access
0| Public
2| Bot Owner
3| Group Admin

Bot Admin Required Commands

kick
add
promote
demote
gcname
gclink

Only these commands require bot admin.

---

🤖 AI Setup

Set one of:

LOVABLE_API_KEY=

or

OPENAI_API_KEY=

or

GEMINI_API_KEY=

---

🔄 401 Logout Protection

If WhatsApp logs out:

1. Session detected as invalid
2. Session auto removed
3. New QR/Pair generated
4. Bot reconnects automatically

No manual fixing needed.

---

📦 Add New Commands

Create a file inside:

cmd/

Example:

module.exports = {
  config: {
    name: "hello",
    aliases: ["hi"],
    permission: 0,
    prefix: false,
    botAdmin: false,
    cooldowns: 3,
    categorie: "Tools"
  },

  start: async ({ api, event }) => {
    api.sendMessage(
      event.threadId,
      { text: "Hello!" },
      { quoted: event.message }
    );
  }
};

Restart bot and command loads automatically.

---

📈 Upcoming Features

- Web Dashboard
- Mobile Admin Panel
- Plugin Marketplace
- Firebase Sync
- MongoDB Support
- Multi-Bot Manager
- Cloud Session Backup

---

<p align="center">
⚡ EMON BOT ⚡Made with ❤️ by EMON HAWLADAR

</p>