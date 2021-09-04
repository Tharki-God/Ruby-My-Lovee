const util = require("../../util");
module.exports = {
    name: "8d",
    description: "Adds the 8D effect",
    level: "Filters",
    type: "CHAT_INPUT",
    exec: async (ctx) => {
        const { interaction, music } = ctx;
        if (!music.player?.track) return interaction.editReply({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
        if (!ctx.member.voice.channel)
            return interaction.editReply({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return interaction.editReply({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
      
        music.set8D(!music.filters["8d"]);  
        interaction.editReply({
            embeds: [util.embed().setDescription(`✅ | ${music.filters["8d"] ? "Enabled" : "Disabled"} **8D**`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
    }
};
