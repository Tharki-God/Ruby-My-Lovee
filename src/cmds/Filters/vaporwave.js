const util = require("../../util");
module.exports = {
    name: "vaporwave",
    aliases: ["vp"],
    usage: "vaporwave",
    description: "Adds the VaporWave effect",
    level: "Filters",
    exec: async (ctx) => {
        const { music } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.player?.track) return ctx.respond({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.member.voice.channel)
            return ctx.respond({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")                                  
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.respond({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)                                  
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
     
        music.setVaporwave(!music.filters.vaporwave);  
        ctx.respond({ embeds: [util.embed().setDescription(`✅ | ${music.filters.vaporwave ? "Enabled" : "Disabled"} **Vaporwave**`)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};
