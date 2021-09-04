const util = require("../../util");

module.exports = {
    name: "previous",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Skip to the Next Song in Queue and Plays it Immediately.",
    exec: async (ctx) => {
        const { music, interaction } = ctx;	
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
        if (!music.previous) 
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Senpai There Are No previous track.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}

        if (music.previous === music.current) 
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ |  They are The Same Picture(I mean Track).")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}
        try {
            music.queue.unshift(music.previous);
            await music.skip();
            music.queue.unshift(music.previous);        
            interaction.editReply({embeds: [util.embed().setDescription("⏮️ | Repeated")]});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
