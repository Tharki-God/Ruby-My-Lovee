const util = require("../../util");

module.exports = {
    name: "join",
    level: "Music",
    type: "CHAT_INPUT",
    description: "Used To Make the Bot Join a Channel.",
    exec: async (ctx) => {	
        const { interaction, music } = ctx;    
        if (!ctx.member.voice.channel) 
        { interaction.editReply({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]});
        return;}
       
        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["VIEW_CHANNEL", "CONNECT", "SPEAK", "MOVE_MEMBERS"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
        {  interaction.editReply({
            embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
        return;}     
        if (ctx.guild.me.voice.channel && ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
        { interaction.editReply({
            embeds: [util.embed().setDescription(` We Are Both are Already at ${ctx.guild.me.voice.channel} (¬_¬ ).`)
                .setAuthor("❌ | BRUH It's Same", "https://cdn.discordapp.com/attachments/775376498769002498/810914597569691718/1.jpg" )
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
        return;}
        else if (!music.player || !music.player?.track) { 		
            if  (ctx.guild.me.voice.channel) {await ctx.guild.members.cache.get(ctx.client.user.id).voice.setChannel(ctx.member.voice.channel);}		
            if (!ctx.guild.me.voice.channel) {			
                await music.join(ctx.member.voice.channel);}		
            await music.reset();
            interaction.editReply({
                embeds: [util.embed().setDescription("🅾 | Joined The VC")]
            });
            return;
        }
        else {
            interaction.editReply({ embeds:[util.embed().setDescription(`❌ | Currently Playing at ${ctx.guild.me.voice.channel}.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;
        }
    }};

