const util = require("../../util");
module.exports = {
    name: "doubletime",
    description: "Double the Speed of Player",
    level: "Filters",
    type: "CHAT_INPUT",
    exec: async (ctx) => {
        const { interaction, music } = ctx;
        if (!music.player?.track) return interaction.editReply({ embded: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]});
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
      
        music.setDoubleTime(!music.filters.doubleTime);  
        interaction.editReply({
            embeds: [util.embed().setDescription(`✅ | ${music.filters.doubleTime ? "Enabled" : "Disabled"} **Double Time**`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
    }

};
