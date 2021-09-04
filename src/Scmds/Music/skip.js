const util = require("../../util");

module.exports = {
    name: "skip",
    type: "CHAT_INPUT",
    level: "Music",
    options: [{
        name: "to",
        description: "Index No. of the song you want to Skip to",
        type:"STRING",
        required:false,
    }],
    description: "Skip to the Next Song in Queue and Plays it Immediately.",
    exec: async (ctx) => {
        const { music, interaction, args } = ctx;
        const skipTo = args[0] ? parseInt(args[0], 10) : null;		
        if (!music.player?.track) 
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}
        if (!ctx.member.voice.channel)
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
        {  interaction.editReply({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length))
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Invalid number to Skip.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });return;}
        try {
            await music.skip(skipTo);          
            interaction.editReply({embeds: [util.embed().setDescription("⏭️ | Skipped")]});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
