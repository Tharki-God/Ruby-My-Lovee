const util = require("../../util");

module.exports = {
    name: "previous",
    type: "CHAT_INPUT",
    level: "Music",
    options: [{
        name: "to",
        description: "Index No. of the song you want to play again",
        type:"STRING",
        required:false,
    }],
    description: "Plays song that have been done playing.",
    exec: async (ctx) => {
        const { music, interaction, args } = ctx;	
        const to = args[0] ? parseInt(args[0], 10) : null;	
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
        if (!music.previous.length) 
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Senpai There Are No previous track.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        return;}
        if (to !== null && ((music.previous.length - to) + 1) > (music.previous.length + 1))
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Use Skip Command to play songs after current track.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });return;}
        if (to === (1 + music.previous.length))
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | You Can't Skip to the Current Song.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });return;}
        try {
            const lastto = to ? (music.previous.length - to) + 1 : null;
            await music.last(lastto);       
            interaction.editReply({embeds: [util.embed().setDescription("⏮️ | Repeated")]});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
