const util = require("../../util");

module.exports = {
    name: "speed",
    level: "Filters",
    description: "Set Custom Speed for music.player",
    type: "CHAT_INPUT",
    options: [{
        name: "speed",
        description: "speed of the track",
        type:"STRING",
        required:false,
    }],
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;

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
        try {
            if (args.length !== 0 && args[0].toLowerCase() == "reset" || args.length !== 0 && args[0].toLowerCase() == "off") {
                music.player.node.send({
                    guildId: ctx.guild.id || ctx.guild,
                    op: "filters",
                    timescale: {speed: 1.0}
                });
                const embed =  util.embed()
                    .setDescription("✅ | Reseted **speed**")
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
                return interaction.editReply({embeds:[embed]});
            }
            if (isNaN(args[0])) return interaction.editReply({embeds:[util.embed().setDescription("❌ |  Specify a number")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});

            if (args[0] < 0.1) return interaction.editReply({embeds:[util.embed().setDescription("❌ |  Speed must be greater than 0")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});

            if (args[0] > 10) return interaction.editReply({embeds:[util.embed().setDescription("❌ |  Speed must be less than 10")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});

            music.player.node.send({
                guildId: ctx.guild.id || ctx.guild,
                op: "filters",
                timescale: { speed : args[0] },
            });
            interaction.editReply({embeds:[util.embed().setDescription(`✅ | Set Speed To **${args[0]}**x`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        } catch (e) {
            ctx.client.logger.error(e.message);
        }
    }
};