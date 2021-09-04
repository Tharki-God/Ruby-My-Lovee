const util = require("../../util");
const fs = require("fs");
const unlisted = ["eval", "clear", "nick", "join", "rickroll"];
module.exports = {
    name: "help",
    level: "Info",
    type: "CHAT_INPUT",
    options: [{
        name: "command",
        description: "Get Help Related to Particular Command.",
        type:"STRING",
        required:false,
    }],
    description: "Displays a list of all current commands and info about commands.",
    exec: async (ctx) => {
        const{interaction, args} = ctx;
        const [ command ] = args;
        const { Info, Music, Misc, Admin, Owner, Filters, Fun } = ctx.client.levels;				
        const commands = {};
        for (const level of Object.values(ctx.client.levels)) {
            commands[level] = [];
        }
        ctx.client.cmds.forEach(cmd => {
            if (!unlisted.includes(cmd.name)) {
                if (!cmd.level) cmd.level = Misc;
                commands[cmd.level].push(`\`${cmd.name}\``);
            }				  	
        });
        let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));
        if(!prefixes[ctx.guild.id]){
            prefixes[ctx.guild.id] = {
                prefix: process.env.PREFIX
            };
        }

        let prefix  = prefixes[ctx.guild.id].prefix;

        const emojiMap = {
            [Info]: `ℹ ${util.capitalize(Info)}`,
            [Music]: `🎼 ${util.capitalize(Music)}`,
            [Misc]: `🔮 ${util.capitalize(Misc)}`,
            [Admin]: `🐱‍👤 ${util.capitalize(Admin)}`,
            [Owner]: `👥${util.capitalize(Owner)}`,
            [Filters]: `🗄 ${util.capitalize(Filters)}`,
            [Fun]: `👙 ${util.capitalize(Fun)}`,
        };
    
        const embed = util.embed()
            .setAuthor("Command List", ctx.client.user.displayAvatarURL())
            .setFooter("Only showing available commands.\n" + ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setImage("https://cdn.discordapp.com/attachments/775376498769002498/880191609302568960/baal-genshin-baal.gif")
            .setDescription(`
          **Prefix:** \`${prefix.toUpperCase()}\`
          **More Information:** \`${prefix.toUpperCase()}help [command]\`
          **In DM:** \`${prefix.toUpperCase()}help DM <command>\`
        `)	
            .setTimestamp();
        for (const level of Object.values(ctx.client.levels)) {
            if (commands[level][0])
                embed.addField(`**${emojiMap[level]} [${commands[level].length}]**`, commands[level].join(" ").toUpperCase());
		
        }
        if (command) {
            const commandName = command;
            const cmd = ctx.client.cmds.get(commandName) || ctx.client.cmds.find(c => c.aliases && c.aliases.includes(commandName));
            if (!cmd)             
                return interaction.editReply(util.embed().setDescription("❌ | Provide a Valid Command For Detailed help.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp());		
            else if (
                cmd 
            ) {const scmd = util.embed()
                .setAuthor(`Command: ${cmd.name.toUpperCase()}`, ctx.client.user.displayAvatarURL()) 
                .setThumbnail("https://cdn.discordapp.com/attachments/775376498769002498/809823096483610684/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            if (cmd.description) scmd.setDescription(cmd.description.toString());
            if (cmd.usage) scmd.addField("Usage", `\`${prefix.toUpperCase()}${cmd.usage.toUpperCase()}\``, true);
            if (cmd.aliases) scmd.addField("Aliases", cmd.aliases.map(c => `\`${c}\``).join(" ").toUpperCase());
            if (cmd.examples) scmd.addField("Examples", cmd.examples.map(c => `\`${prefix.toUpperCase()}${c}\``).join("\n").toUpperCase());
            interaction.editReply({embeds:[scmd]});
            return;}}
        
                 
        interaction.editReply({embeds:[embed]});    
    }
};
