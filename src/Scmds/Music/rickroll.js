const util = require("../../util");
const fs = require("fs");
let pussy;
module.exports = {
    name: "rickroll",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Plays Never Gonna Give you You",
    exec: async (ctx) => {
        let owner = await ctx.guild.fetchOwner();  
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        const { music, interaction } = ctx;
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
    
        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return interaction.editReply({
                embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
    
        if (music.node.state !== 1)
            return interaction.editReply({
                embeds: [util.embed()
                    .setAuthor("❌ | Try Again Later.",ctx.client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription("Lavalink node is not connected yet.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
			
        try {
            const { tracks } = await music.load("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            const track = tracks[0];
            track.requester = ctx.author;
            music.queue.unshift(track);  
            await music.skip();

            if (!music.player) await music.join(ctx.member.voice.channel);
            if (!music.player.track) {
                let plymsg;
                if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
                if (plymsg) plymsg.delete();
                let pussy;	
                messageez[ctx.guild.id] = {
                    ID: pussy
                };	
                fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                    if (err) ctx.client.logger.error(err.stack);
                });	
                await music.start();}
            interaction.editReply({
                embeds: [util.embed().setDescription("✅ | Rick Rolled~. ")	
                    .setAuthor(music.queue[0].info.author, owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.client.logger.error(e.stack);
			
        }
    }


};