const util = require("../../util");

module.exports = {
    name: "skip",
    aliases: ["s", "chutiya"],
    usage: "skip",
    level: "Music",
    description: ["Skip to the Next Song in Queue and Plays it Immediately. ^_^"],
    exec: async (ctx) => {
        const { music, args } = ctx;
        const skipTo = args[0] ? parseInt(args[0], 10) : null;		
        if (!music.player?.track) 
        {if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (!ctx.member.voice.channel)
        {  if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
        {  if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length))
        {  if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Invalid number to Skip.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});return;}
        try {
            await music.skip(skipTo);
            if (ctx.guild.purge) setTimeout(() => ctx.msg.delete(), 6000);
            ctx.msg.reply({embeds: [util.embed().setDescription("⏭️ | Skipped")], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
