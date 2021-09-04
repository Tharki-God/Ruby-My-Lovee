const util = require("../../util");
const fs = require("fs");
let pussy;

module.exports = {
    name: "volume",
    level: "Music",
    type: "CHAT_INPUT",
    options: [{
        name: "percentage",
        description: "Percentage of Volume",
        type:"STRING",
        required:true,
    }],
    description: "Sets The Bot Playing Volume Out of 150",
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;
        const newVolume = parseInt(args[0], 10);
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));
				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        if (!music.player) {		
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")				
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return; }
       
        try {
            if (isNaN(newVolume)) {
                interaction.editReply({ embeds:[util.embed().setDescription("⛔ | You Need to Provide Volume Percentage. Eg: 69")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]});
                return;
            } else {
                if (!ctx.member.voice.channel) {
                    interaction.editReply({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                        .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()]});
                    return;}
                if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
                    interaction.editReply({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                        .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()]});
                    return;}
                if (newVolume < 0 || newVolume > 150)
                {interaction.editReply({ embeds: [util.embed().setDescription("❌ | You can only set the volume from 0 to 150.")
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]});
                return;}
                await music.setVolume(newVolume);
                interaction.editReply({ embeds: [util.embed().setDescription(`✅ |  Volume Set to ${music.volume}%`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]});
                let plymsg;
                if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
                if (music.volume <= 0) {
                    if (plymsg) {               
                        const nah = plymsg.embeds[0];
                        nah.fields[3] = { name: "Volume", value: `🔇 | ${music.volume}%`, inline: true };
                        await plymsg.edit({
                            embeds :[nah]
                        });
                    
                    }
                    return;}
                else if (101 <= music.volume) {
                    if (plymsg) {               
                        const nah = plymsg.embeds[0];
                        nah.fields[3] = { name: "Volume", value: `🔊 | ${music.volume}%`, inline: true };
                        await plymsg.edit({
                            embeds :[nah]
                        });
                        
                    }
                    return;
                } else {
                    if (plymsg) {               
                        const nah = plymsg.embeds[0];
                        nah.fields[3] = { name: "Volume", value: `💬 | ${music.volume}%`, inline: true };
                        await plymsg.edit({
                            embeds :[nah]
                        });
                        
                    }
                    return;}
		
            }
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
		
    }
};
