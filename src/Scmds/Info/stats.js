const prettyMs = require("pretty-ms");
const util = require("../../util");
const { mem, cpu} = require("node-os-utils");
const moment = require("moment");

module.exports = {
    name: "stats",
    level: "Info",
    type: "CHAT_INPUT",
    description: "Shows The Stats and Condition of Bot and Its Player. Nothing Special (^///^)",
    exec: async (ctx) => {   
        const { interaction } = ctx;   
        const nodes = [...ctx.client.shoukaku.nodes.values()];		
        const d = moment.duration(ctx.client.uptime);
        const days = (d.days() == 1) ? `${d.days()} day` : `${d.days()} days`;
        const hours = (d.hours() == 1) ? `${d.hours()} hour` : `${d.hours()} hour`;
        const minutes = (d.minutes() == 1) ? `${d.minutes()} minute` : `${d.minutes()} minute`;
        const seconds = (d.seconds() == 1) ? `${d.seconds()} second` : `${d.seconds()} second`;
        const clientStats = `\`\`\`asciidoc
Servers :: ${ctx.client.guilds.cache.size}
Users :: ${ctx.client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)} 
Channels :: ${ctx.client.channels.cache.size}
Discord.Js Ping :: ${Math.round(ctx.client.ws.ping)}ms
My Ping :: ${Math.floor(Date.now() - interaction.createdTimestamp)}ms
Uptime :: ${days}(s) and ${hours}(s) and ${minutes}(s) and ${seconds}(s)\`\`\``;
		
        const { totalMemMb, usedMemMb } = await mem.info();
        const serverStats = `\`\`\`asciidoc
CPU  :: ${cpu.model()}
Cores :: ${cpu.count()}
CPU Usage :: ${await cpu.usage()} %
RAM :: ${totalMemMb} MB
RAM Usage :: ${usedMemMb} MB \`\`\``;
        let lavalink;
        nodes.map(node  => {
            const cpuLoad = (node.stats.cpu.lavalinkLoad * 100).toFixed(2);
            const memUsage = (node.stats.memory.used / 1024 / 1024).toFixed(2);
            const uptime = prettyMs(node.stats.uptime, { verbose: false, secondsDecimalDigits: 0 });
            lavalink = `\`\`\`asciidoc
Lavalink ID        :: ${node.name.toUpperCase()}
Lavalink Status    :: ${node.state === 1 ? "Connected" : "Disconnected"}
${node.state === 1 ? `
CPU Load :: ${cpuLoad}%
Memory Usage :: ${memUsage} MB
Lavalink Player Uptime :: ${uptime}
Lavalink Players :: ${node.stats.playingPlayers} of ${node.stats.players} Playing` : ""}\`\`\``;});

        interaction.editReply({embeds:[util.embed()
            .setAuthor("Get My Stats Free of Cost Just like...", ctx.client.user.displayAvatarURL(), "https://www.youtube.com/c/LinusTechTips")
            .setTitle("Just Kinda Redstone on Discord")
            .setURL("https://www.youtube.com/watch?v=ooL9nVQA6qU")
            .addField("ctx.client",clientStats)
            .addField("Server",serverStats)
            .addField("Lavalink",lavalink)
            .setFooter("🤬 | Nothing Out of Ordinary, is It? Just Tell The Truth! (I mean Report it to the Dev!)", ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
        ]});
    }
};

