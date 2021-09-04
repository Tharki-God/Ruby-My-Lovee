const util = require("../util");
const fs = require("fs");
const { Collection } = require("discord.js");
const cooldowns = new Map();
const CommandContext = require("../structures/CommandContext");
module.exports = {
    name: "messageCreate",
    exec: async (client, msg) => {			
        if (!msg.guild || msg.author.bot || msg.webhookId) return;
        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;
        
        if (!msg.channel.guild) return msg.reply({ content: 'I can\'t execute commands inside DMs! Please run this command in a server.', allowedMentions: { repliedUser: false } }).catch(() => {return null;});;
        if (msg.channel.type === 'DM') {
            let embed = util.embed()
                .setColor('RED')
                .setDescription('This command can only be run in a server!');
            return msg.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(() => {return null;});;
        }
        let channels = JSON.parse(fs.readFileSync("./database/channels.json", "utf8"));
        if (channels[msg.guild.id] && channels[msg.guild.id].channel && await msg.guild.channels.cache.get(channels[msg.guild.id].channel) !== undefined && msg.channel.id !== channels[msg.guild.id].channel) return;
        let response = JSON.parse(fs.readFileSync("./database/reactions.json", "utf8"));
        if (response[msg.guild.id])	{
            if(response[msg.guild.id][msg.content.toLowerCase()]) {
                msg.channel.send({content: response[msg.guild.id][msg.content.toLowerCase()]});
            }}	
        let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));		
        if(!prefixes[msg.guild.id]){
            prefixes[msg.guild.id] = {
                prefix: process.env.PREFIX
            };
        }
        let purge = JSON.parse(fs.readFileSync("./database/purge.json", "utf8"));		
        if(!purge[msg.guild.id]){
            purge[msg.guild.id] = {
                status: true
            };
        }
        msg.guild.purge = purge[msg.guild.id].status;
        if (msg.guild.purge && !msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) {
msg.channel.send({ content: "Purge is On for Guild, Please give me Manage message Perms so I can execute the purge when needed.", allowedMentions: { repliedUser: false } })
msg.guild.purge = false
        }
        let prefix  = prefixes[msg.guild.id].prefix;
        const senpai = `<@!${client.user.id}>`;
        const yametee = msg.content.toLowerCase().startsWith(prefix) ? prefix : senpai;
        if (msg.content.includes(senpai)) 
        {msg.author.send({ embeds: [util.embed().setDescription(`ಥ_ಥ | Use This Prefix To Access Commands =  ${prefix.toUpperCase()}`)		
            .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).catch(() => {return null;});}
        if (!msg.content.toLowerCase().startsWith(yametee)) return;
        const args = msg.content.slice(yametee.length).trim().split(/ +/g);		        
        const cmdName = args.shift().toLowerCase();		
        const cmd = client.cmds.get(cmdName) || client.cmds.find(c => c.aliases && c.aliases.includes(cmdName));	
	
        if (cmd) {
            if (!msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) return msg.channel.send({ content: 'I can\'t execute commands With these perms! Ask someone to Get me Embed Link Perms in this channel so That I use this command here.', allowedMentions: { repliedUser: false } });
            if (msg.author.id !== process.env.OWNER_ID){
                if(!cooldowns.has(cmd.name)){
                    cooldowns.set(cmd.name, new Collection());
                }    
                const current_time = Date.now();
                const time_stamps = cooldowns.get(cmd.name);
                const cooldown_amount =  10000;      
                if(time_stamps.has(msg.author.id)){
                    const expiration_time = time_stamps.get(msg.author.id) + cooldown_amount;        
                    if(current_time < expiration_time){
                        const time_left = (expiration_time - current_time) / 1000;  
                        if (msg.guild.purge) setTimeout(() => msg.delete(), 9000);  
                        return msg.reply({ embeds: [util.embed().setDescription(`Please wait ${time_left.toFixed(1)} more seconds before using ${util.capitalize(cmd.name)} Command Again.`)		
                            .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 8000);}});
                    }
                }
                time_stamps.set(msg.author.id, current_time);
                setTimeout(() => time_stamps.delete(msg.author.id), cooldown_amount);}
            try {
                await cmd.exec(new CommandContext(cmd, msg, args));
                
            } catch (e) {
                client.logger.error(e.stack);
            }
        }
    }
};