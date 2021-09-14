const util = require("../../util");

module.exports = {
    name: "removedupes",
    type: "CHAT_INPUT",
    description: "Removes duplicated tracks from the queue.",
    level: "Music",
    exec: (ctx) => {
        const { interaction, music } = ctx;
        const aseen = {};
        const bseen = {};

        if (!music.player?.track) {		
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return; }
        if (!music.queue.length && !music.previous.length) 
        { interaction.editReply({ embeds: [util.embed().setDescription("❌ | Queue is empty.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}
        if (!ctx.member.voice.channel) 
        { interaction.editReply({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) 
        { interaction.editReply({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        return;}

       

        for (const song of music.queue) {
            if (aseen[song.info.indentifier] === undefined) aseen[song.info.indentifier] = song;
        }
        music.queue = Object.values(aseen);
        for (const song of music.previous) {
            if (bseen[song.info.indentifier] === undefined) bseen[song.info.indentifier] = song;
        }
        music.previous = Object.values(bseen);
        interaction.editReply({ embeds: [util.embed().setDescription("✅ | Removed all Dupes")] }).catch(e => e);
    }
};
