const util = require("../../util");
module.exports = {
    name: "remove",
    aliases: ["rm"],
    level: "Music",
    usage: "remove [Song Index No.]",
    examples: ["remove 69"],
    description: [`Used To Remove a Specific Song In the Queue. 
  ಠ_ಠ`],
    exec: async (ctx) => {
        const { music, args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.player?.track) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!music.queue.length) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Queue is empty.")		
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

        if (!args[0]) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Your Need to Provide Index No Of Song.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Invalid number to remove.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        const removed = music.queue.splice(--iToRemove, 1)[0];
        ctx.channel.send({ embeds: [util.embed().setDescription(`✅ | Removed **${removed.info.title}** from the queue.`)		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 15000);}});
    }
};



