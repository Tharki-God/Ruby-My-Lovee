const fs = require("fs");
const util = require("../util");
const { Collection } = require("discord.js");
const Icooldowns = new Map();
const InteractionContext = require("../structures/InteractionContext");
module.exports = {
    name: "interactionCreate",
    exec: async (client, interaction) => { 
        let purge = JSON.parse(fs.readFileSync("./database/purge.json", "utf8"));		
        if(!purge[interaction.guild.id]){
            purge[interaction.guild.id] = {
                status: true
            };
        }
        interaction.guild.purge = purge[interaction.guild.id].status; 
        if (interaction.isCommand()) {	
            if (!interaction.guild || interaction.channel.type === "DM") {
                let embed = util.embed()
                    .setColor("RED")
                    .setDescription("This command can only be run in a server!");
                return interaction.reply({ embeds: [embed], ephemeral: false });
            }		
            await interaction.deferReply({ ephemeral: interaction.guild.purge }).catch(() => {});   
      
            const cmd = client.Scmds.get(interaction.commandName);
            if (!cmd)
            {return interaction.editReply({ content: "An error has occured " });}  
            const args = [];    
            for (let option of interaction.options.data) {
                if (option.type === "SUB_COMMAND") {
                    if (option.name) args.push(option.name);
                    option.options?.forEach((x) => {
                        if (x.value) args.push(x.value);
                    });
                } else if (option.value) args.push(option.value);
            } 
            if (cmd){
                if (interaction.user.id !== process.env.OWNER_ID) { if(!Icooldowns.has(cmd.name)){
                    Icooldowns.set(cmd.name, new Collection());
                }    
                const current_time = Date.now();
                const time_stamps = Icooldowns.get(cmd.name);
                const cooldown_amount =  8000;      
                if(time_stamps.has(interaction.user.id)){
                    const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;        
                    if(current_time < expiration_time){
                        const time_left = (expiration_time - current_time) / 1000;  
                        return interaction.user.editReply({ embeds: [util.embed().setDescription(`Please wait ${time_left.toFixed(1)} more seconds before using ${util.capitalize(cmd.name)} Command Again.`)		
                            .setFooter(interaction.user.username,  interaction.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]});
                    }
                }
                time_stamps.set(interaction.user.id, current_time);
                setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);}
                try {
                    await cmd.exec(new InteractionContext(client, interaction, args));
                
                } catch (e) {
                    client.logger.error(e.stack);
                }
        
            }
        } if (interaction.isContextMenu()) {
            await interaction.deferReply({ ephemeral: interaction.guild.purge });
            const cmd = client.Scmds.get(interaction.commandName);
            
            if (cmd){
                if (interaction.user.id !== process.env.OWNER_ID) { if(!Icooldowns.has(cmd.name)){
                    Icooldowns.set(cmd.name, new Collection());
                }    
                const current_time = Date.now();
                const time_stamps = Icooldowns.get(cmd.name);
                const cooldown_amount =  8000;      
                if(time_stamps.has(interaction.user.id)){
                    const expiration_time = time_stamps.get(interaction.user.id) + cooldown_amount;        
                    if(current_time < expiration_time){
                        const time_left = (expiration_time - current_time) / 1000;  
                        return interaction.user.editReply({ embeds: [util.embed().setDescription(`Please wait ${time_left.toFixed(1)} more seconds before using ${util.capitalize(cmd.name)} Command Again.`)		
                            .setFooter(interaction.user.username,  interaction.user.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]});
                    }
                }
                time_stamps.set(interaction.user.id, current_time);
                setTimeout(() => time_stamps.delete(interaction.user.id), cooldown_amount);}
                try {
                    await cmd.exec(new InteractionContext(client, interaction));
                
                } catch (e) {
                    client.logger.error(e.stack);
                }
            }
        }  
    }
    
};