const util = require("../../util");
module.exports = {
    name: "resume",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Resume The Song Currently Being Paused.",
    exec: async (ctx) => {
        const { music, interaction } = ctx;
        const fs = require("fs");
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));
        let pussy;
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;	
        if (!music.player?.track) {		
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return; }
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
		
        try {
            await music.resume();			
            let plymsg;
            if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
            if (plymsg) {               
                const nah = plymsg.embeds[0];
                nah.author.name = "🎶 | Now Playing";  
                await plymsg.edit({
                    embeds :[nah]
                });
            
            }
            interaction.editReply({
                embeds: [util.embed().setDescription("▶ | Resumed")]
            });
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};


