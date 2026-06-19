# ✦ EMON BOT — Professional WhatsApp Multi-Device Bot

**Owner:** EMON HAWLADAR  
**Number:** 8801309991724  
**Email:** emonhawladar311@gmail.com  
*All credit — EMON HAWLADAR*

---

## ✦ Features

- 🚀 **24/7 Auto-Restart** (`start.js` wrapper, auto-relaunch on crash / 401)
- 🔑 **Multi-Owner** system (edit `Emon/config.js` → `OWNERS`)
- 🔌 **QR + Pairing-Code** login (set `loginMode` in config)
- 📲 **Replies to inbox & own messages**
- ⚡ **No-prefix mode** — every command works with **or without** `.`
- 🎬 **Auto Downloader** — paste any FB/IG/TT/YT/Twitter/Pinterest link and it downloads
- 🤖 **AI Chat** with **per-group personality** (Lovable / OpenAI / Gemini)
- 🛡️ **Moderation:** antilink, warn/unwarn (auto-kick at 3), ban/unban
- 👮 **Group:** kick, add, promote, demote, tagall, hidetag, gcinfo, gclink, gcname
- 📣 **Broadcast** to all groups
- 🎭 **70+ fun commands** (ship, gay, hot, iq, joke, dice, 8ball, rps, ...)
- 📦 **VIP console loader** with per-command load status
- 💾 **Auto-saving database** (`Emon/database.json`) every 30s

---

## ✦ Permission system (FIXED — 0 / 2 / 3 only)

| Level | Who can use |
|-------|------------|
| `0`   | **Public** — everyone |
| `2`   | **Bot Owner only** (numbers in `OWNERS`) |
| `3`   | **Group admin + bot admin** |

> ❌ Level `1` is removed.  
> ❌ "Bot must be admin" only appears for commands that **actually need it** (`botAdmin: true` in command config — `kick`, `add`, `promote`, `demote`, `gcname`, `gclink`).  
> ✅ Other commands no longer wrongly demand admin.

---

## ✦ Folder Structure

```
EmonBot/
├── Emon/
│   ├── config.js            ← owners, prefix, AI, login mode
│   ├── settings.json        ← antilink, welcome, bans
│   ├── database.json        ← warnings, stats
│   ├── logs/
│   └── session/             ← creds.json lives here
├── cmd/                     ← 77+ command files (drop new .js to add)
├── index.js                 ← main bot
├── start.js                 ← auto-restart wrapper (use this for 24/7)
└── package.json
```

---

## ✦ Setup

```bash
npm install
node start.js        # 24/7 auto-restart
# or
pm2 start start.js --name EmonBot
```

### Login modes
- **QR** (default) — scan from WhatsApp → Linked Devices.
- **Pairing code** — set `loginMode: "pair"` and `pairingNumber` in `Emon/config.js`. Code appears in console.

### AI key
Set one of these env vars to enable `.ai`:
```
LOVABLE_API_KEY=...     # recommended
OPENAI_API_KEY=...
GEMINI_API_KEY=...
```

---

## ✦ The 401 / "Disconnected — Logged out" fix

When WhatsApp logs the session out (code 401), the bot now:
1. Detects it.
2. **Auto-deletes** `Emon/session/` (the bad credentials).
3. Reconnects → shows a new QR / pairing code.
4. `start.js` keeps the process alive indefinitely.

---

## ✦ Adding new commands

Drop any `.js` file into `cmd/` shaped like:

```js
module.exports = {
  config: {
    name: "hello",
    aliases: ["hi"],
    permission: 0,            // 0 | 2 | 3
    prefix: false,            // false → works without prefix too
    botAdmin: false,          // true → require bot to be group admin
    cooldowns: 3,
    categorie: "Tools",
    description: "Say hi",
    credit: "EMON HAWLADAR"
  },
  start: async ({ api, event, args }) => {
    api.sendMessage(event.threadId, { text: "Hello!" }, { quoted: event.message });
  },
  // optional: passive listener on every message
  event: async ({ event, api, body }) => {},
  // optional: reply handler
  handleReply: async ({ api, event, handleReply }) => {}
};
```

Restart and the VIP loader picks it up automatically.

---

## ✦ Roadmap (planned)

- Web Dashboard + Mobile Admin Panel
- Plugin Store
- Cloud Database Sync (Firebase / Mongo)
- Multi-instance manager

— *Built with ❤️ by EMON HAWLADAR*
