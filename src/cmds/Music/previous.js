const util = require("../../util");

module.exports = {
    name: "previous",
    level: "Music",
    aliases: ["prev", "last", "again", "please", "fuck", "no"],
    usage: "previous",
    description: ["Play the Song Being Played before The Current one Again. ^_^"],
    exec: async (ctx) => {
        const { music, args } = ctx;	
        const to = args[0] ? parseInt(args[0], 10) : null;		
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
        if (!music.previous.length) 
        { if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Senpai There Are No previous track.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        if (!music.previous.length) 
        { ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Senpai There Are No previous track.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}
        if (to !== null && ((music.previous.length - to) + 1) > (music.previous.length + 1))
        { ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Use Skip Command to play songs after current track.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}
        if (to === (1 + music.previous.length))
        { ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Can't Skip to the Current Song.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}
        try {
            const lastto = to ? (music.previous.length - to) + 1 : null;
            await music.last(lastto);   
            if (ctx.guild.purge) setTimeout(() => ctx.msg.delete(), 6000);
            ctx.msg.reply({embeds: [util.embed().setDescription("⏮️ | Repeated")], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
