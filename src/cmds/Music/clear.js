const util = require("../../util");

module.exports = {
    name: "clear",
    aliases: ["new", "end", "senpai", "stop"],
    usage: "clear",
    level: "Music",
    description: [`Used to Clear All The Song From Queue.
	Wouldn't Leave the VC (☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)`],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!music.player?.track) {		
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return; }
        if (!ctx.member.voice.channel) {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (!music.queue.length && !music.previous.length) {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Queue is empty.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}

        try {
            let first = music.queue[0];
            music.queue = [];
            music.queue.push(first);	
            let last = music.previous[0];
            music.previous = [];
            music.previous.push(last);	         
            if (ctx.guild.purge) setTimeout(() => ctx.msg.delete(), 6000);
            ctx.respond({
                embeds: [util.embed().setDescription("🧹 | Cleared Queue")]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
                  
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
      
       
    }
};

