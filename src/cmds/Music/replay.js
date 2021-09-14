const util = require("../../util");


module.exports = {
    name: "replay",
    level: "Music",
    aliases: ["rp"],
    usage: "replay",
    type: "CHAT_INPUT",
    description: "Replay the current song from start.",
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player?.track) {		
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return; }
        if (!ctx.member.voice.channel) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            ctx.channel.send({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        if (!music.current.info.isSeekable) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Current track isn't seekable.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

     

        try {
            await music.player.seekTo(0);
            ctx.channel.send({ embeds:[util.embed().setDescription(`✅ | Playing ${music.current.info.title} From Start}.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};