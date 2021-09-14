const { Permissions } = require("discord.js");
const util = require("../../util");
const fs = require("fs");
module.exports =  {
    name: "prune",
    aliases: ["done", "lick"], 
    level: "Admin",
    usage: "prune",
    description: "Purges the bot Command and messgaes by bot",		
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.channel.permissionsFor(ctx.guild.me).has("MANAGE_MESSAGES")) 
            return ctx.channel.send({ embeds: [util.embed().setDescription("Purge is On for Guild, Please give me Manage message Perms so I can execute the purge when needed.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()], allowedMentions: { repliedUser: false } }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            
        let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));		
        if(!prefixes[ctx.guild.id]){
            prefixes[ctx.guild.id] = {
                prefix: process.env.PREFIX
            };
        }
        let prefix  = prefixes[ctx.guild.id].prefix;
        const senpai = `<@!${ctx.client.user.id}>`;
        const messages =  ctx.channel.messages.fetch();
        const botmessages = (await messages).filter((msg) => { if (msg.pinned) {return false;} else  return msg.author.id === msg.client.user.id;}); 
        const cmdmessages = (await messages).filter((msg) => {
            if (msg.pinned) {return false;} 
            const yametee = msg.content.toLowerCase().startsWith(prefix) ? prefix : senpai;
            if (!msg.content.toLowerCase().startsWith(yametee)) return false;
            const args = msg.content.slice(yametee.length).trim().split(/ +/g);		        
            const cmdName = args.shift().toLowerCase();		
            const cmd = ctx.client.cmds.get(cmdName) || ctx.client.cmds.find(c => c.aliases && c.aliases.includes(cmdName));	
            if (cmd) return true;
        });
        const todelete = await botmessages.concat(cmdmessages);
        let i = 0;
        todelete.forEach(async (msg) => {           
            setTimeout(
                function(){

                    msg.delete();
                }
                , ++i * 1500);});
    
        /*await ctx.channel.bulkDelete(botmessages).catch(()=> {return null;});
        await ctx.channel.bulkDelete(cmdmessages).catch(()=> {return null;});*/
        
        ctx.channel.send({embeds: [util.embed().setDescription(`Will be Deleting ${todelete.size} Messages By Bot and its commands.`)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
        /*let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));		
        if(!prefixes[ctx.guild.id]){
            prefixes[ctx.guild.id] = {
                prefix: process.env.PREFIX
            };
        }
        let prefix  = prefixes[ctx.guild.id].prefix;
        const senpai = `<@!${ctx.client.user.id}>`;
        const messages =  ctx.channel.messages.fetch();
        await (await messages).forEach((msg) => {
            setTimeout(() => {
                if (msg.author.id === msg.client.user.id) {
                    msg.delete();
                }
                const yametee = msg.content.toLowerCase().startsWith(prefix) ? prefix : senpai;
                if (msg.content.toLowerCase().startsWith(yametee)) {
                    const args = msg.content.slice(yametee.length).trim().split(/ +/g);		        
                    const cmdName = args.shift().toLowerCase();		
                    const cmd = ctx.client.cmds.get(cmdName) || ctx.client.cmds.find(c => c.aliases && c.aliases.includes(cmdName));	
                    if (cmd) {
                        msg.delete();}}
            }, 10000);                            
        });
            
        ctx.channel.send({embeds: [util.embed().setDescription("Deleted All Messages By Bot and its commands.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});*/
        
        
            
            
	
	
    }
};