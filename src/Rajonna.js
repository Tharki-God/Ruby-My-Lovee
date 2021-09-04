  
const { Intents } = require("discord.js");
const { GUILDS, GUILD_MESSAGES, GUILD_VOICE_STATES, GUILD_MESSAGE_REACTIONS, GUILD_EMOJIS_AND_STICKERS, DIRECT_MESSAGES } = Intents.FLAGS;
const MusicClient = require("./structures/MusicClient");

const client = new MusicClient({
    intents: [GUILDS, GUILD_MESSAGES, GUILD_VOICE_STATES, GUILD_MESSAGE_REACTIONS, GUILD_EMOJIS_AND_STICKERS, DIRECT_MESSAGES],
    allowedMentions: {
        parse: ["users", "roles"]
    },
    restTimeOffset: 0
});

client.build();