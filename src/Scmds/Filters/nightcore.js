const util = require("../../util");
module.exports = {
    name: "nightcore",
    level: "Filters",
    type: "CHAT_INPUT",
    description: "Adds the NightCore effect",
    exec: async (ctx) => {
        const {interaction, music } = ctx;
        if (!music.player?.track) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
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
      
        music.setNightcore(!music.filters.nightcore);  
        interaction.editReply({
            embeds: [util.embed().setDescription(`✅ | ${music.filters.nightcore ? "Enabled" : "Disabled"} [**Nightcore**]`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
    }
};
