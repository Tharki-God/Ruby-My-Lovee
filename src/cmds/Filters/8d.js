const util = require("../../util");
module.exports = {
    name: "8d",
    description: "Adds the 8D effect",
    usage: "8d",
    aliases: ["rotation"],
    level: "Filters",
    exec: async (ctx) => {
        const { music } = ctx;
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
      
        music.set8D(!music.filters["8d"]);  
        ctx.channel.send({
            embeds: [util.embed().setDescription(`✅ | ${music.filters["8d"] ? "Enabled" : "Disabled"} **8D**`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};
