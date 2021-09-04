const util = require("../../util");
module.exports = {
    name: "remove",
    type:"CHAT_INPUT",
    level: "Music",
    options: [{
        name: "to",
        description: "Index No. of the song you want to remove.",
        type:"STRING",
        required:true,
    }],
    description: "Used To Remove a Specific Song In the Queue.",
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;
        if (!music.player?.track) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        if (!music.queue.length) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Queue is empty.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });

        if (!ctx.member.voice.channel)
            return interaction.editReply({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return interaction.editReply({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });

  

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Invalid number to remove.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });

        const removed = music.queue.splice(--iToRemove, 1)[0];
        interaction.editReply({ embeds: [util.embed().setDescription(`✅ | Removed **${removed.info.title}** from the queue.`)		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 15000);}});
    }
};



