const util = require("../../util");
const fs = require("fs");
let pussy;
module.exports = {
    name: "rickroll",
    aliases: ["rick", "boom", "bommer", "never", "atsley", ""],
    level: "Music",
    usage: "rickroll",
    description: ["Plays Never Gonna Give you You"],
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        const { music } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!ctx.member.voice.channel)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    
        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    
        if (music.node.state !== 1)
            return ctx.channel.send({
                embeds: [util.embed()
                    .setAuthor("❌ | Try Again Later.",ctx.client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription("Lavalink node is not connected yet.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
			
        try {
            const { tracks } = await music.load("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            music.queue = [];
            music.loop = 0;
            const track = tracks[0];
            track.requester = ctx.author;
            music.queue.push(track);  
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
            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.client.logger.error(e.stack);
			
        }
    }


};