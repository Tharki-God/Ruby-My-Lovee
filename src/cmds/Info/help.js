const util = require("../../util");
const fs = require("fs");

const unlisted = ["eval", "clear", "nick", "join", "rickroll"];

module.exports = {
    name: "help",
    aliases: ["commands", "?", "h"],
    usage: "help [Command | DM]",
    level: "Info",
    examples: ["help ping"],
    description: ["Displays a list of all current commands.",
        "Can be used in conjunction with a command for additional information.",
        "( ´･･)ﾉ(._.`)"],
    exec: (ctx) => {
        const { args } = ctx;
        
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
        if (ctx.guild.purge) ctx.msg.delete();
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

			
			
			
	
        if (args[0]) {
            if (args[0].toLowerCase() === "all")
                ctx.channel.send({embeds:[embed]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 15000);}});
            if (args[0].toLowerCase() === "dm") {
                if (args[1]) {
                    args.shift();
                    const commandName = args.shift().toLowerCase();
                    const command = ctx.client.cmds.get(commandName) || ctx.client.cmds.find(c => c.aliases && c.aliases.includes(commandName));		
                    if (!command)             
                        return ctx.author.send({embeds:[util.embed().setDescription("❌ | Provide a Valid Command For Detailed help.")			
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 15000);}});    
                    else if (
                        command 
                    ) {const cmd = util.embed()
                        .setAuthor(`Command: ${command.name.toUpperCase()}`, ctx.client.user.displayAvatarURL()) 
                        .setThumbnail("https://cdn.discordapp.com/attachments/775376498769002498/809823096483610684/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")
                        .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp();
                    if (command.description) cmd.setDescription(command.description);
                    if (command.usage) cmd.addField("Usage", `\`${prefix.toUpperCase()}${command.usage.toUpperCase()}\``, true);
                    if (command.aliases) cmd.addField("Aliases",command.aliases.map(c => `\`${c}\``).join(" ").toUpperCase());
                    if (command.examples) cmd.addField("Examples",command.examples.map(c => `\`${prefix.toUpperCase()}${c}\``).join("\n").toUpperCase());
                    ctx.author.send({embeds:[cmd]});}
                } else ctx.author.send({embeds:[embed]});
                return;}
            const commandName = args.shift().toLowerCase();
            const command = ctx.client.cmds.get(commandName) || ctx.client.cmds.find(c => c.aliases && c.aliases.includes(commandName));
            if (!command)             
                return ctx.channel.send(util.embed().setDescription("❌ | Provide a Valid Command For Detailed help.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 15000);}});		
            else if (
                command 
            ) {const cmd = util.embed()
                .setAuthor(`Command: ${command.name.toUpperCase()}`, ctx.client.user.displayAvatarURL()) 
                .setThumbnail("https://cdn.discordapp.com/attachments/775376498769002498/809823096483610684/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f.gif")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp();
            if (command.description) cmd.setDescription(command.description);
            if (command.usage) cmd.addField("Usage", `\`${prefix.toUpperCase()}${command.usage.toUpperCase()}\``, true);
            if (command.aliases) cmd.addField("Aliases", command.aliases.map(c => `\`${c}\``).join(" ").toUpperCase());
            if (command.examples) cmd.addField("Examples", command.examples.map(c => `\`${prefix.toUpperCase()}${c}\``).join("\n").toUpperCase());
            ctx.channel.send({embeds:[cmd]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});}
            return;
        }          
        ctx.channel.send({embeds:[embed]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});    
    }
};
