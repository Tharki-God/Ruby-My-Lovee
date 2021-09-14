const util = require("../../util");

module.exports = {
    name: "move",
    level: "Music",
    type: "CHAT_INPUT",
    options: [{
        name: "from",
        description: "Index no. of the song you want to Move.",
        type:"STRING",
        required:true,
    }, 
    {
        name: "to",
        description: "Index no. where you want to Move the song to.",
        type:"STRING",
        required:true,
    }],
    description: "Used to Chnage the Position of Song in the Queue.",
    exec: async (ctx) => {
        const { interaction, music, args } = ctx;
        const from = args[0] ? parseInt(args[0], 10) : null;
        const to = args[1] ? parseInt(args[1], 10) : null;
        if (!music.player?.track) {		
            if (ctx.guild.purge) ctx.msg.delete();
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return; }
        if (!ctx.member.voice.channel) {
            if (ctx.guild.purge) ctx.msg.delete();
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            if (ctx.guild.purge) ctx.msg.delete();
            interaction.editReply({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}
        if (!music.queue.length && !music.previous.length) {
            if (ctx.guild.purge) ctx.msg.delete();
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Queue is empty.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
            return;}

       

        if (from === to || (isNaN(from) || from < 1 || from > (music.previous.length + music.queue.length)) || (isNaN(to) || to < 1 || to > (music.previous.length + music.queue.length))) {
            interaction.editReply({ embeds: [util.embed().setDescription("❌ | Number is invalid or exceeds queue length.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
            });
            return;}
        if (from <= (music.previous.length) || to <= (music.previous.length))
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | You can not Move already Played Songs.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        if (from === (music.previous.length + 1) || to === (music.previous.length + 1))
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | You can not Move to/from Current Song Songs.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });

        const moved = music.queue[(from - (music.previous.length + 1)) - 1];

        util.moveArrayElement(music.queue, (from - (music.previous.length + 1)) - 1, (to - (music.previous.length + 1)) - 1);
        interaction.editReply({ embeds: [util.embed().setDescription(`✅ | Moved **${moved.info.title}** to \`${to}\`.`)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]
        });
    }
};