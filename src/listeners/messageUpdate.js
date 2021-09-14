const util = require("../util");
const fs = require("fs");
const { Collection } = require("discord.js");
const cooldowns = new Map();
const CommandContext = require("../structures/CommandContext");
module.exports = {
    name: "messageUpdate",
    exec: async (client, oldMessage, newMessage) => {   
        if (newMessage.member && newMessage.Id === newMessage.member.lastMessageId) 
        {     if (!newMessage.guild || newMessage.author.bot || newMessage.webhookId) return;
            if (!newMessage.channel.permissionsFor(newMessage.guild.me).has("SEND_MESSAGES")) return;
            if (!newMessage.channel.guild) return newMessage.reply({ content: "I can't execute commands inside DMs! Please run this command in a server.", allowedMentions: { repliedUser: false } }).catch(() => {return null;});
            if (newMessage.channel.type === "DM") {
                let embed = util.embed()
                    .setColor("RED")
                    .setDescription("This command can only be run in a server!");
                return newMessage.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(() => {return null;});
            }
            let channels = JSON.parse(fs.readFileSync("./database/channels.json", "utf8"));
            if (channels[newMessage.guild.id] && channels[newMessage.guild.id].channel && newMessage.guild.channels.cache.get(channels[newMessage.guild.id].channel) !== undefined && newMessage.channel.id !== channels[newMessage.guild.id].channel) return;
            let response = JSON.parse(fs.readFileSync("./database/reactions.json", "utf8"));
            if (response[newMessage.guild.id])	{
                if(response[newMessage.guild.id][newMessage.content.toLowerCase()]) {
                    newMessage.channel.send({content: response[newMessage.guild.id][newMessage.content.toLowerCase()]});
                }}	
            let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));		
            if(!prefixes[newMessage.guild.id]){
                prefixes[newMessage.guild.id] = {
                    prefix: process.env.PREFIX
                };
            }
            let purge = JSON.parse(fs.readFileSync("./database/purge.json", "utf8"));		
            if(!purge[newMessage.guild.id]){
                purge[newMessage.guild.id] = {
                    status: true
                };
            }
            newMessage.guild.purge = purge[newMessage.guild.id].status;
            if (newMessage.guild.purge && !newMessage.channel.permissionsFor(newMessage.guild.me).has("MANAGE_MESSAGES")) {
                newMessage.channel.send({ content: "Purge is On for Guild, Please give me Manage message Perms so I can execute the purge when needed.", allowedMentions: { repliedUser: false } });
                newMessage.guild.purge = false;
            }
            let prefix  = prefixes[newMessage.guild.id].prefix;
            const senpai = `<@!${client.user.id}>`;
            const yametee = newMessage.content.toLowerCase().startsWith(prefix) ? prefix : senpai;
            if (newMessage.content.includes(senpai)) 
            {newMessage.author.send({ embeds: [util.embed().setDescription(`ಥ_ಥ | Use This Prefix To Access Commands =  ${prefix.toUpperCase()}`)		
                .setFooter(newMessage.author.username,  newMessage.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).catch(() => {return null;});}
            if (!newMessage.content.toLowerCase().startsWith(yametee)) return;
            const args = newMessage.content.slice(yametee.length).trim().split(/ +/g);		        
            const cmdName = args.shift().toLowerCase();		
            const cmd = client.cmds.get(cmdName) || client.cmds.find(c => c.aliases && c.aliases.includes(cmdName));	
        
            if (cmd) {
                if (!newMessage.channel.permissionsFor(newMessage.guild.me).has("EMBED_LINKS")) return newMessage.channel.send({ content: "I can't execute commands With these perms! Ask someone to Get me Embed Link Perms in this channel so That I use this command here.", allowedMentions: { repliedUser: false } });
                if (newMessage.author.id !== process.env.OWNER_ID){
                    if(!cooldowns.has(cmd.name)){
                        cooldowns.set(cmd.name, new Collection());
                    }    
                    const current_time = Date.now();
                    const time_stamps = cooldowns.get(cmd.name);
                    const cooldown_amount =  10000;      
                    if(time_stamps.has(newMessage.author.id)){
                        const expiration_time = time_stamps.get(newMessage.author.id) + cooldown_amount;        
                        if(current_time < expiration_time){
                            const time_left = (expiration_time - current_time) / 1000;  
                            if (newMessage.guild.purge) setTimeout(() => newMessage.delete(), 9000);  
                            return newMessage.reply({ embeds: [util.embed().setDescription(`Please wait ${time_left.toFixed(1)} more seconds before using ${util.capitalize(cmd.name)} Command Again.`)		
                                .setFooter(newMessage.author.username,  newMessage.author.displayAvatarURL({ dynamic: true }))
                                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 8000);}});
                        }
                    }
                    time_stamps.set(newMessage.author.id, current_time);
                    setTimeout(() => time_stamps.delete(newMessage.author.id), cooldown_amount);}
                try {
                    await cmd.exec(new CommandContext(cmd, newMessage, args));
                    
                } catch (e) {
                    client.logger.error(e.stack);
                }
            }
        }
    }
};