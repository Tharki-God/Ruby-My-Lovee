const util = require("../../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    usage: "Seek [Time]",
    level: "Music",
    examples: ["Seek 1:34"],
    description: ["Used to Seek to a Timing in Currently Played song. ᓚᘏᗢ"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.player?.track) {		
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return; }
        if (!ctx.member.voice.channel) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            ctx.channel.send({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        if (!music.current.info.isSeekable) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Current track isn't seekable.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        const duration = args[0];
        if (!duration) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must provide duration to seek. Valid duration e.g. `1:34`.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        if (!durationPattern.test(duration)) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You provided an invalid duration. Valid duration e.g. `1:34`.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length) {
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | The duration you provide exceeds the duration of the current track.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        try {
            await music.player.seekTo(durationMs);
            ctx.channel.send({ embeds:[util.embed().setDescription(`✅ | Seeked to ${util.millisToDuration(durationMs)}.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};