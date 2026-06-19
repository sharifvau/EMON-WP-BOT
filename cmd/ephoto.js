const mumaker = require('mumaker');

const links = {
    metallic: "https://en.ephoto360.com/impressive-decorative-3d-metal-text-effect-798.html",
    ice: "https://en.ephoto360.com/ice-text-effect-online-101.html",
    snow: "https://en.ephoto360.com/create-a-snow-3d-text-effect-free-online-621.html",
    impressive: "https://en.ephoto360.com/create-3d-colorful-paint-text-effect-online-801.html",
    matrix: "https://en.ephoto360.com/matrix-text-effect-154.html",
    light: "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html",
    neon: "https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html",
    devil: "https://en.ephoto360.com/neon-devil-wings-text-effect-online-683.html",
    purple: "https://en.ephoto360.com/purple-text-effect-online-100.html",
    thunder: "https://en.ephoto360.com/thunder-text-effect-online-97.html",
    leaves: "https://en.ephoto360.com/green-brush-text-effect-typography-maker-online-153.html",
    "1917": "https://en.ephoto360.com/1917-style-text-effect-523.html",
    arena: "https://en.ephoto360.com/create-cover-arena-of-valor-by-mastering-360.html",
    hacker: "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html",
    sand: "https://en.ephoto360.com/write-names-and-messages-on-the-sand-online-582.html",
    blackpink: "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html",
    glitch: "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html",
    fire: "https://en.ephoto360.com/flame-lettering-effect-372.html"
};

const allTypes = Object.keys(links);

module.exports = {
    config: {
        name: "ephoto",
        aliases: ["tmaker", "textmaker"],
        category: "Tools",
        description: "Generate stunning text effects.",
        usage: ".ephoto <type> <text>"
    },
    start: async ({ api, event, args }) => {
        const { threadId } = event;
        const type = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!type || !links[type] || !text) {
            let menu = `✨ *EPHOTO TEXT MAKER* ✨\n\n`;
            menu += `*Usage:* .ephoto <type> <text>\n`;
            menu += `*Example:* .ephoto neon Emon\n\n`;
            menu += `*Available Styles:*\n${allTypes.join(', ')}\n\n`;
            menu += `🤖 *Powered by EMON-BOT*`;
            return api.sendMessage(threadId, { text: menu });
        }

        try {
            await api.sendMessage(threadId, { text: "⏳ *Generating your effect... Please wait.*" });
            
            const result = await mumaker.ephoto(links[type], text);
            if (!result?.image) throw new Error("API failed to return image.");

            await api.sendMessage(threadId, {
                image: { url: result.image },
                caption: `✅ *Successfully Generated!*\n✨ Style: ${type}\n🤖 Power: EMON-BOT`
            });

        } catch (error) {
            await api.sendMessage(threadId, { text: `❌ *Error:* ${error.message}` });
        }
    }
};
