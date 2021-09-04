const util = require("../../util");

module.exports = {
    name: "clear",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Used to Clear All The Song From Queue.",
    exec: async (ctx) => {
        const { interaction,    music } = ctx;
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
        if (!music.queue.length) {            
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Queue is empty.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

        try {
            music.queue.splice(0, 1);	         
            interaction.editReply({
                embeds: [util.embed().setDescription("🧹 | Cleared Queue")]
            });
                  
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
      
       
    }
};

