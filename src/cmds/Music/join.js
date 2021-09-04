const util = require("../../util");

module.exports = {
    name: "join",
    aliases: ["jn", "arigato", "ohayoa", "ohayo", "hentai"],
    level: "Music",
    usage: "join",
    description: ["Used To Make the Bot Join a Channel.",
        "( ´･･)ﾉ(._.`)"],
    exec: async (ctx) => {	
        const { music } = ctx;    
        if (!ctx.member.voice.channel) 
        {if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
       
        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["VIEW_CHANNEL", "CONNECT", "SPEAK", "MOVE_MEMBERS"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
        { if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}     
        if (ctx.guild.me.voice.channel && ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
        {if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({
                embeds: [util.embed().setDescription(` We Are Both are Already at ${ctx.guild.me.voice.channel} (¬_¬ ).`)
                    .setAuthor("❌ | BRUH It's Same", "https://cdn.discordapp.com/attachments/775376498769002498/810914597569691718/1.jpg" )
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        else if (!music.player || !music.player?.track) { 		
            if  (ctx.guild.me.voice.channel) {await ctx.guild.members.cache.get(ctx.client.user.id).voice.setChannel(ctx.member.voice.channel);}		
            if (!ctx.guild.me.voice.channel) {			
                await music.join(ctx.member.voice.channel);}		
            await music.reset();
            if (ctx.guild.purge) setTimeout(() => ctx.msg.delete(), 6000);
            ctx.respond({
                embeds: [util.embed().setDescription("🅾 | Joined The VC")]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
            return;
        }
        else {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription(`❌ | Currently Playing at ${ctx.guild.me.voice.channel}.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;
        }
    }};

