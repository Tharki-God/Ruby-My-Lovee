const util = require("../../util");
const fs = require("fs");
module.exports = {
    name: "leave",
    aliases: ["nooo", "dc"],
    usage: "leave",
    level: "Music",
    description: ["Leave Voice Chat. (•_•)"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (!ctx.guild.me.voice.channel) {		
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | Currently not in Any VC.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return; }
        if (!ctx.member.voice.channel) {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription("❌ | You must be on a voice channel.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return;}
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel)) {
            if (ctx.guild.purge) ctx.msg.delete();
            ctx.channel.send({ embeds:[util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
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
            if (ctx.guild.purge) setTimeout(() => ctx.msg.delete(), 6000);
            await music.node.leaveChannel(ctx.guild.id);
            ctx.respond({
                embeds: [util.embed().setDescription("⏹️ | Disconnected")]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
            
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }

			
    }
};
