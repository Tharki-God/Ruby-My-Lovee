const util = require("../../util");
const fs = require("fs");
module.exports = {
    name: "leave",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Leave Voice Chat.",
    exec: async (ctx) => {
        const { interaction, music } = ctx;
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
	
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));
        let pussy;
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;

        try {
            music.stop();
            let plymsg;
            if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
            if (ctx.guild.purge && plymsg) plymsg.delete();
            await music.node.leaveChannel(ctx.guild.id);
            interaction.editReply({
                embeds: [util.embed().setDescription("⏹️ | Disconnected")]
            });
            
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }

			
    }
};
