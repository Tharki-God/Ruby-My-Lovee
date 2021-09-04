const util = require("../../util");
module.exports = {
    name: "bassboost",
    description: "Set bassboost for player",
    usage: "bassboost [percentage]",
    examples: ["bassboost 50"],
    aliases: ["bb"],
    level: "Filters",
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.player?.track) return ctx.channel.send({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.member.voice.channel)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        if (!args[0]) {
            ctx.channel.send({embeds:[util.embed().setDescription(`${music.filters.bassboost ? `✅ | BassBoost **${music.bassboost * 100}%**` : "❌ | BassBoost **off**"}`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        } else if (args[0].toLowerCase() == "off") {
            music.setBassboost(0);
            ctx.channel.send({embeds:[util.embed().setDescription("❌ | BassBoost **off**")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        } else {
            if (isNaN(args[0])) return ctx.channel.send({embeds:[util.embed().setDescription("❌ | Specify a number")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            if (args[0] < 1 || args[0] > 100) return ctx.channel.send({embeds:[util.embed().setDescription("❌ | You can only set the bassboost from 1 to 100.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            music.setBassboost(parseInt(args[0]));
            ctx.channel.send({embeds:[util.embed().setDescription(`✅ | BassBoost set to **${music.bassboost * 100}%**`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        }
    }
};
