const util = require("../../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    level: "Music",
    options: [{
        name: "time",
        description: "Timing where you want to seek the song to.",
        type:"STRING",
        required:true,
    }],
    type: "CHAT_INPUT",
    description: "Used to Seek to a Timing in Currently Played song.",
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;
        if (!music.player?.track) {		
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return; }
        if (!ctx.member.voice.channel) {
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            interaction.editReply({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        if (!music.current.info.isSeekable) {
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Current track isn't seekable.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        const duration = args[0];

        if (!durationPattern.test(duration)) {
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | You provided an invalid duration. Valid duration e.g. `1:34`.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length) {
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | The duration you provide exceeds the duration of the current track.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        try {
            await music.player.seekTo(durationMs);
            interaction.editReply({ embeds:[util.embed().setDescription(`✅ | Seeked to ${util.millisToDuration(durationMs)}.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};