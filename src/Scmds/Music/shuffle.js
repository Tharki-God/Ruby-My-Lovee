const util = require("../../util");

module.exports = {
    name: "shuffle",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Shuffles The Songs in Queue Once",
    exec: async (ctx) => {
        const { music, interaction } = ctx;      
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
        if (!music.queue.length) {
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Queue is empty.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        music.queue = util.shuffleArray(music.queue);
        interaction.editReply({embeds: [util.embed().setDescription("Use Queue Command to see changes.")		
            .setFooter("Use Queue Command to see changes.")]});

       
    }
};
