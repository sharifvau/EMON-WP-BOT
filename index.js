// ╔══════════════════════════════════════════════════════════╗
// ║      EMON BOT — Professional WhatsApp Multi-Device Bot   ║
// ║      Author: EMON HAWLADAR                               ║
// ║      Contact: emonhawladar311@gmail.com                  ║
// ║      All credit — EMON HAWLADAR                          ║
// ╚══════════════════════════════════════════════════════════╝

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");
const NodeCache = require("node-cache");
const chalk = require("chalk");
const moment = require("moment-timezone");
const axios = require("axios");

const config = require("./Emon/config.js");
const SESSION_DIR  = path.join(__dirname, "Emon", "session");
const SETTINGS_FILE = path.join(__dirname, "Emon", "settings.json");
const DB_FILE      = path.join(__dirname, "Emon", "database.json");
const LOG_DIR      = path.join(__dirname, "Emon", "logs");
[SESSION_DIR, LOG_DIR, path.join(__dirname, "cmd", "cache")].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// ───────── GitHub Sources ─────────
const GH_ADMIN_URL = "https://raw.githubusercontent.com/sharifvau/Emon-Server/refs/heads/main/wpAdmin.json";
const GH_BAN_URL   = "https://raw.githubusercontent.com/sharifvau/Emon-Server/refs/heads/main/wpBan.json";
const GH_INDEX_URL = "https://raw.githubusercontent.com/sharifvau/EMON-WP-BOT/main/index.js"; // auto-update source (optional)

global.ADMINS = [];
global.GLOBAL_BANS = [];
global.GH_READY = false;            // false হলে বট কোনো reply দেবে না
global.LAST_GH_OK = 0;

// ───────── Globals ─────────
global.config = config;
global.client = { commands: new Map(), aliases: new Map(), handleReply: [], handleReaction: [], cooldowns: new Map() };
global.settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
global.db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

// settings defaults
global.settings.replyInbox = global.settings.replyInbox ?? true;   // inbox এ reply করবে কি না
global.settings.replyGroup = global.settings.replyGroup ?? true;   // group এ reply করবে কি না
global.settings.disabledCommands = global.settings.disabledCommands || [];
global.settings.bannedUsers = global.settings.bannedUsers || [];
global.settings.bannedGroups = global.settings.bannedGroups || [];
global.settings.antilink = global.settings.antilink || {};
global.settings.welcome = global.settings.welcome || {};
global.settings.welcomeText = global.settings.welcomeText || {};

function saveJSON(file, obj){ try{ fs.writeFileSync(file, JSON.stringify(obj,null,2)); }catch(e){} }
global.saveSettings = () => saveJSON(SETTINGS_FILE, global.settings);
global.saveDB = () => saveJSON(DB_FILE, global.db);
setInterval(() => { global.saveSettings(); global.saveDB(); }, 30000);

global.setAntilinkSetting = (tid,val) => { global.settings.antilink[tid]=val; global.saveSettings(); };
global.getAntilinkSetting = (tid) => global.settings.antilink[tid] || "off";

function digitsOnly(j=""){ return String(j).replace(/[^0-9]/g,""); }

global.isOwner = (jid) => {
  const n = digitsOnly(jid);
  const list = [...(config.OWNERS||[]), ...global.ADMINS];
  return list.some(o => { const d = digitsOnly(o); return d && (n === d || n.endsWith(d)); });
};
global.isGlobalAdmin = global.isOwner;
global.isGlobalBanned = (jid) => {
  const n = digitsOnly(jid);
  return global.GLOBAL_BANS.some(b => {
    const d = digitsOnly(b.number || b.id || "");
    return d && (n === d || n.endsWith(d));
  });
};

// ───── Logger ─────
function log(tag,msg,color="white"){
  const time = moment().tz(config.TIMEZONE || "Asia/Dhaka").format("HH:mm:ss");
  const c = chalk[color] || chalk.white;
  console.log(chalk.gray(`[${time}]`) + " " + c(`[${tag}]`) + " " + msg);
}
global.log = log;

// ───── GitHub fetchers ─────
async function fetchAdmins(){
  try{
    const { data } = await axios.get(GH_ADMIN_URL, { timeout: 10000 });
    // supports either ["88..","..."] OR { admins:[...] }
    const list = Array.isArray(data) ? data : (data.admins || []);
    global.ADMINS = list.map(String);
    global.GH_READY = true;
    global.LAST_GH_OK = Date.now();
    log("GH", chalk.green(`✓ Global admins loaded (${global.ADMINS.length})`), "green");
  }catch(e){
    global.GH_READY = false;
    log("GH", chalk.red(`✗ wpAdmin.json fetch failed: ${e.message}`), "red");
  }
}
async function fetchBans(){
  try{
    const { data } = await axios.get(GH_BAN_URL, { timeout: 10000 });
    global.GLOBAL_BANS = Array.isArray(data) ? data : (data.bans || []);
    log("GH", chalk.green(`✓ Global bans loaded (${global.GLOBAL_BANS.length})`), "green");
  }catch(e){
    log("GH", chalk.yellow(`! wpBan.json fetch failed: ${e.message}`), "yellow");
  }
}
async function refreshGitHub(){
  await Promise.all([fetchAdmins(), fetchBans()]);
}
refreshGitHub();
setInterval(refreshGitHub, 5 * 60 * 1000); // প্রতি 5 মিনিটে চেক

// ───── Optional Auto-Update from GitHub ─────
async function autoUpdateIndex(){
  if (!config.AUTO_UPDATE) return;
  try{
    const { data } = await axios.get(GH_INDEX_URL, { timeout: 15000, responseType: "text" });
    const localPath = path.join(__dirname, "index.js");
    const local = fs.readFileSync(localPath, "utf8");
    if (typeof data === "string" && data.length > 500 && data !== local){
      const backup = path.join(__dirname, "Emon", "logs", `index.backup.${Date.now()}.js`);
      fs.writeFileSync(backup, local);
      fs.writeFileSync(localPath, data);
      log("UPDATE", chalk.green("✓ index.js updated from GitHub → restarting"), "green");
      process.exit(0); // start.js wrapper will restart
    }
  }catch(e){
    log("UPDATE", chalk.yellow(`! auto-update skipped: ${e.message}`), "yellow");
  }
}
setInterval(autoUpdateIndex, 10 * 60 * 1000);

// ───── Load commands ─────
function loadCommands(){
  global.client.commands.clear();
  global.client.aliases.clear();
  const dir = path.join(__dirname, "cmd");
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".js"));
  let ok=0, fail=0;
  const names = [];
  for (const f of files){
    try{
      delete require.cache[require.resolve(path.join(dir,f))];
      const mod = require(path.join(dir,f));
      if (!mod.config || !mod.config.name){ fail++; continue; }
      global.client.commands.set(mod.config.name.toLowerCase(), mod);
      (mod.config.aliases||[]).forEach(a => global.client.aliases.set(a.toLowerCase(), mod.config.name.toLowerCase()));
      ok++; names.push(mod.config.name);
    }catch(e){
      fail++;
      log("CMD", chalk.red(`✗ ${f} → ${e.message}`), "red");
    }
  }
  console.log(chalk.magenta.bold("\n╔══════════════════════════════════════════════════════╗"));
  console.log(chalk.magenta.bold("║                  EMON BOT START                      ║"));
  console.log(chalk.magenta.bold("╚══════════════════════════════════════════════════════╝"));
  console.log(chalk.cyan(`✦ Loaded ${ok} commands, ${fail} failed`));
  console.log(chalk.gray("✦ Command List:"));
  // 6 per row
  const cols = 6;
  for (let i=0; i<names.length; i+=cols){
    console.log("  " + names.slice(i,i+cols).map(n=>chalk.green(n.padEnd(14))).join(" "));
  }
  console.log("");
}

// ───── Permission ─────
// 0 = Public | 2 = Owner/Global Admin only | 3 = Group Admin (or Owner)
async function hasPermission(level, ctx){
  if (!level || level === 0) return true;
  if (global.isOwner(ctx.senderId)) return true;
  if (level === 2) return false;
  if (level === 3) return ctx.isSenderAdmin === true;
  return false;
}

// ───── Bot admin check (reusable, cached) ─────
async function checkAdmins(sock, threadId, senderId){
  try{
    const meta = await sock.groupMetadata(threadId);
    const botNum = digitsOnly(sock.user.id.split(":")[0]);
    const senderNorm = jidNormalizedUser(senderId);

    const sender = meta.participants.find(p => jidNormalizedUser(p.id) === senderNorm);
    const isSenderAdmin = !!(sender && (sender.admin === "admin" || sender.admin === "superadmin"));

    const bot = meta.participants.find(p => digitsOnly(p.id).startsWith(botNum));
    const isBotAdmin = !!(bot && (bot.admin === "admin" || bot.admin === "superadmin"));

    return { isSenderAdmin, isBotAdmin, meta };
  }catch(e){
    return { isSenderAdmin: false, isBotAdmin: false, meta: null };
  }
}
global.isAdmin = async (api, threadId, senderId) => checkAdmins(api, threadId, senderId);

// ───── Auto downloader pattern + dedupe ─────
const VIDEO_LINK_RX = /(https?:\/\/[^\s]+(facebook\.com|fb\.watch|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|pinterest\.com)[^\s]*)/i;
const RECENT_DL = new Map(); // key=threadId+url → ts
function shouldDownload(threadId, url){
  const key = threadId + "|" + url;
  const now = Date.now();
  const last = RECENT_DL.get(key) || 0;
  if (now - last < 60_000) return false;
  RECENT_DL.set(key, now);
  // cleanup
  if (RECENT_DL.size > 500){
    for (const [k,v] of RECENT_DL) if (now - v > 300_000) RECENT_DL.delete(k);
  }
  return true;
}

// ───── Connection ─────
async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_DIR);
  const { version } = await fetchLatestBaileysVersion();
  const msgRetryCache = new NodeCache();

  const sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    printQRInTerminal: config.loginMode === "qr",
    browser: ["EMON BOT", "Chrome", "3.0"],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" }))
    },
    msgRetryCounterCache: msgRetryCache,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.downloadMediaMessage = async (message) => {
    const type = Object.keys(message)[0];
    const stream = await downloadContentFromMessage(message[type] || message, type.replace("Message",""));
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
    return buffer;
  };

  if (config.loginMode === "pair" && !sock.authState.creds.registered){
    setTimeout(async () => {
      try{
        const code = await sock.requestPairingCode(digitsOnly(config.pairingNumber));
        console.log(chalk.green.bold(`\n  ✦ PAIRING CODE → ${code}\n`));
      }catch(e){ log("PAIR", e.message, "red"); }
    }, 3000);
  }

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (u) => {
    const { connection, lastDisconnect, qr } = u;
    if (qr && config.loginMode === "qr") qrcode.generate(qr, { small: true });
    if (connection === "open"){
      log("WA", chalk.green(`✓ Connected as ${sock.user.id}`), "green");
    } else if (connection === "close"){
      const code = new Boom(lastDisconnect?.error).output?.statusCode;
      log("WA", chalk.yellow(`✗ Disconnected (${code})`), "yellow");
      if (code === DisconnectReason.loggedOut || code === 401){
        try{
          log("WA", "Session invalid → wiping Emon/session and re-pairing...", "red");
          fs.rmSync(SESSION_DIR, { recursive: true, force: true });
          fs.mkdirSync(SESSION_DIR, { recursive: true });
        }catch{}
      }
      // সব ক্ষেত্রেই auto reconnect (off হয়ে যাওয়া ফিক্স)
      setTimeout(() => startBot().catch(e => log("BOOT", e.message, "red")), 2500);
    }
  });

  // ───── Welcome ─────
  sock.ev.removeAllListeners("group-participants.update");
  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;
    if (action === "add" && global.settings.welcome?.[id]){
      for (let jid of participants){
        const participantJid = typeof jid === "string" ? jid : jid.id;
        const name = participantJid.split("@")[0];
        let welcomeText = global.settings.welcomeText?.[id] || "👋 স্বাগতম @name! আমাদের গ্রুপে জয়েন করার জন্য ধন্যবাদ।";
        welcomeText = welcomeText.replace("@name", `@${name}`);
        try{
          let ppUrl=null;
          try{ ppUrl = await sock.profilePictureUrl(participantJid, "image"); }catch{}
          if (ppUrl) await sock.sendMessage(id, { image:{url:ppUrl}, caption:welcomeText, mentions:[participantJid] });
          else await sock.sendMessage(id, { text: welcomeText, mentions:[participantJid] });
        }catch(e){ log("WELCOME", e.message, "red"); }
        await new Promise(r => setTimeout(r, 1500));
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;
    for (const m of messages){
      try{ await handleMessage(sock, m); }
      catch(e){
        log("ERR", chalk.red(e.message), "red");
        // bot continues — never crash
      }
    }
  });

  return sock;
}

// ───── Message handler ─────
async function handleMessage(sock, m){
  if (!m.message) return;
  const threadId = m.key.remoteJid;
  const isGroup = threadId.endsWith("@g.us");
  const fromMe = !!m.key.fromMe;

  // self-reply allowed (REPLY_TO_SELF)
  if (fromMe && !config.REPLY_TO_SELF) return;

  // group/inbox toggle
  if (isGroup && global.settings.replyGroup === false) return;
  if (!isGroup && global.settings.replyInbox === false) return;
  if (!isGroup && !config.REPLY_TO_INBOX && global.settings.replyInbox !== true) return;

  // GitHub admin list না পেলে বট রেসপন্স দেবে না
  if (!global.GH_READY){
    // শুধু একবার নোটিস (inbox এ)
    if (!isGroup){
      try{ await sock.sendMessage(threadId, { text:
`⚠️ Bot offline mode.
Global admin list (GitHub) লোড হয়নি।
দয়া করে admin 8801309991724 কে জানান।` }, { quoted: m }); }catch{}
    }
    return;
  }

  const msg = m.message;
  const body =
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.buttonsResponseMessage?.selectedButtonId ||
    msg.listResponseMessage?.singleSelectReply?.selectedRowId ||
    "";

  const senderId = isGroup
    ? (m.key.participant || m.participant || m.key.remoteJid)
    : (fromMe ? sock.user.id : threadId);

  // Global ban (GitHub) — owner ছাড়া কেউ ব্যবহার করতে পারবে না
  if (global.isGlobalBanned(senderId) && !global.isOwner(senderId)){
    try{
      const banInfo = global.GLOBAL_BANS.find(b => digitsOnly(b.number||b.id||"") &&
        digitsOnly(senderId).endsWith(digitsOnly(b.number||b.id||"")));
      await sock.sendMessage(threadId, { text:
`🚫 আপনি Global Ban list এ আছেন।
কারণ: ${banInfo?.reason || "N/A"}
আনব্যানের জন্য যোগাযোগ করুন: 8801309991724` }, { quoted: m });
    }catch{}
    return;
  }

  // Admin info (group)
  let isSenderAdmin=false, isBotAdmin=false;
  if (isGroup){
    const r = await checkAdmins(sock, threadId, senderId);
    isSenderAdmin = r.isSenderAdmin;
    isBotAdmin = r.isBotAdmin;
  }
  if (global.isOwner(senderId)) isSenderAdmin = true;

  const react = async (emoji) => { try{ await sock.sendMessage(threadId, { react:{ text:emoji, key:m.key } }); }catch{} };

  const event = {
    threadId, senderId, isGroup, isSenderAdmin, isBotAdmin,
    fromMe, message: m, react, body, pushName: m.pushName || ""
  };

  // plugin event hooks
  for (const cmd of global.client.commands.values()){
    if (typeof cmd.event === "function"){
      try{ await cmd.event({ event, api: sock, body }); }
      catch(e){ log("EVT", `${cmd.config.name}: ${e.message}`, "red"); }
    }
  }

  global.db.stats = global.db.stats || {};
  global.db.stats.messagesSeen = (global.db.stats.messagesSeen||0) + 1;

  // handleReply
  const ctxInfo = msg.extendedTextMessage?.contextInfo;
  if (ctxInfo?.stanzaId){
    const r = global.client.handleReply.find(x => x.messageID === ctxInfo.stanzaId);
    if (r){
      const cmd = global.client.commands.get(r.name);
      if (cmd?.handleReply){
        try{ return await cmd.handleReply({ api: sock, event, handleReply: r }); }
        catch(e){ log("REPLY", e.message, "red"); }
      }
    }
  }

  if (!body) return;

  // ── Command parse (prefix বা no-prefix) ──
  const prefix = config.PREFIX;
  let cmdLine = null;
  if (body.startsWith(prefix)) cmdLine = body.slice(prefix.length).trim();
  else if (config.ALLOW_NO_PREFIX) cmdLine = body.trim();
  if (!cmdLine) return;

  const [rawName, ...args] = cmdLine.split(/\s+/);
  // emoji বা special char কমান্ড নাম হতে পারে না (❌ এর মতো)
  if (!/^[a-z0-9_\-]+$/i.test(rawName)) return;

  const name = rawName.toLowerCase();
  let cmd = global.client.commands.get(name) || global.client.commands.get(global.client.aliases.get(name));

  // ── Auto downloader (dedupe, একবারই চলবে) ──
  if (!cmd && config.AUTO_DOWNLOAD_LINKS && VIDEO_LINK_RX.test(body)){
    const match = body.match(VIDEO_LINK_RX);
    if (match && shouldDownload(threadId, match[1])){
      const alldown = global.client.commands.get("alldown");
      if (alldown?.start){
        try{ return await alldown.start({ api: sock, event, args:[match[1]], body: match[1] }); }
        catch(e){ log("AUTODL", e.message, "red"); }
      }
    }
    return;
  }
  if (!cmd) return;

  // disabled / local ban
  if (global.settings.disabledCommands.includes(cmd.config.name)) return;
  const senderNumber = digitsOnly(senderId);
  if (!global.isOwner(senderId)){
    const isBanned = global.settings.bannedUsers.some(uid => digitsOnly(uid) === senderNumber);
    if (isBanned){
      await sock.sendMessage(threadId, { text: "❌ দুঃখিত, আপনি এই বটের জন্য ব্যানড।" }, { quoted: m });
      return;
    }
    if (isGroup && global.settings.bannedGroups.includes(threadId)) return;
  }

  // permission
  if (!(await hasPermission(cmd.config.permission || 0, { senderId, isSenderAdmin }))){
    return sock.sendMessage(threadId, { text: `🚫 You don't have permission to use *${cmd.config.name}*.` }, { quoted: m });
  }

  // bot admin requirement
  if (isGroup && cmd.config?.botAdmin === true && !isBotAdmin){
    return sock.sendMessage(threadId, { text:
`⚠️ Bot Admin Required

❌ This command requires me to be a group admin.

👑 Please promote the bot as admin and try again.` }, { quoted: m });
  }

  // group admin requirement (cmd.config.groupAdmin = true)
  if (isGroup && cmd.config?.groupAdmin === true && !isSenderAdmin){
    return sock.sendMessage(threadId, { text: `🚫 এই কমান্ড শুধু group admin রা ব্যবহার করতে পারবে।` }, { quoted: m });
  }

  // cooldown
  const cd = (cmd.config.cooldowns || 0) * 1000;
  if (cd > 0){
    const key = `${cmd.config.name}:${senderId}`;
    const last = global.client.cooldowns.get(key) || 0;
    if (Date.now() - last < cd) return;
    global.client.cooldowns.set(key, Date.now());
  }

  if (config.AUTO_TYPING){ try{ await sock.sendPresenceUpdate("composing", threadId); }catch{} }

  try{
    await cmd.start({ api: sock, event, args, body });
    global.db.stats.commandsRun = (global.db.stats.commandsRun||0) + 1;
    log("RUN", chalk.cyan(cmd.config.name) + chalk.gray(` by ${senderNumber}`), "white");
  }catch(e){
    log("RUN", chalk.red(`${cmd.config.name}: ${e.message}`), "red");
    try{
      await sock.sendMessage(threadId, { text:
`❌ Error in *${cmd.config.name}*
Reason: ${e.message}

Bot is still running ✅` }, { quoted: m });
    }catch{}
  }
}

// ───── Boot ─────
process.on("uncaughtException", (e) => log("UNCAUGHT", e.message, "red"));
process.on("unhandledRejection", (e) => log("REJECTION", e?.message || String(e), "red"));

loadCommands();
startBot().catch(e => {
  log("BOOT", e.message, "red");
  // crash না করে retry
  setTimeout(() => startBot().catch(()=>process.exit(1)), 5000);
});
