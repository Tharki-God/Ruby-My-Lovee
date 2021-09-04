const util = require("../../util");

module.exports = {
    name: "speed",
    level: "Filters",
    description: "Set Custom Speed for music.player",
    usage: "speed [x]",
    examples: ["speed 4"],
    exec: async (ctx) => {
        const { music, args } = ctx;

        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.music.player?.track) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
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
                return ctx.channel.send({embeds:[embed]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            }
            if (isNaN(args[0])) return ctx.channel.send({embeds:[util.embed().setDescription("❌ |  Specify a number")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

            if (args[0] < 0.1) return ctx.channel.send({embeds:[util.embed().setDescription("❌ |  Speed must be greater than 0")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

            if (args[0] > 10) return ctx.channel.send({embeds:[util.embed().setDescription("❌ |  Speed must be less than 10")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

            music.player.node.send({
                guildId: ctx.guild.id || ctx.guild,
                op: "filters",
                timescale: { speed : args[0] },
            });
            ctx.channel.send({embeds:[util.embed().setDescription(`✅ | Set Speed To **${args[0]}**x`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        } catch (e) {
            ctx.client.logger.error(e.message);
        }
    }
};