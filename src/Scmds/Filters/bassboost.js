const util = require("../../util");
module.exports = {
    name: "bassboost",
    description: "Set bassboost for player",
    options: [{
        name: "percentage",
        description: "Percentage of Bassboost",
        type:"STRING",
        required:false,
    }],
    level: "Filters",
    type: "CHAT_INPUT",
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;
        const [percentage] =args;
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

        if (!percentage) {
            interaction.editReply({embeds:[util.embed().setDescription(`${music.filters.bassboost ? `✅ | BassBoost **${music.bassboost * 100}%**` : "❌ | BassBoost **off**"}`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        } else if (percentage.toLowerCase() == "off") {
            music.setBassboost(0);
            interaction.editReply({embeds:[util.embed().setDescription("❌ | BassBoost **off**")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        } else {
            if (isNaN(percentage)) return interaction.editReply({embeds:[util.embed().setDescription("❌ | Specify a number")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            if (percentage < 1 || percentage > 100) return interaction.editReply({embeds:[util.embed().setDescription("❌ | You can only set the bassboost from 1 to 100.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            music.setBassboost(parseInt(percentage));
            interaction.editReply({embeds:[util.embed().setDescription(`✅ | BassBoost set to **${music.bassboost * 100}%**`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        }
    }
};
