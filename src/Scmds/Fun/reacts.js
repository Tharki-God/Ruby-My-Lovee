const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "reacts",
    level: "Fun",
    type: "CHAT_INPUT",
    options: [
        {
            name: "add",
            description: "Add A trigger and response",
            type:"SUB_COMMAND",
            options:[{
                name: "trigger",
                description: "Trigger of the reaction you want to Add.",
                type:"STRING",
                required:true,
            },
            {
                name: "reaction",
                description: "Reaction for the set Trigger.",
                type:"STRING",
                required:true,
            }]
        },
        {
            name: "remove",       
            description: "Remove A trigger and response",
            type:"SUB_COMMAND",
            options:[{
                name: "trigger",
                description: "Trigger of the reaction you want to remove.",
                type:"STRING",
                required:true,
            }]
        },

    ],
    description: "Add A trigger and response",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [subcommand, trigger , reaction] = args;
        let response = JSON.parse(fs.readFileSync("./database/reactions.json", "utf8"));
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return interaction.editReply({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
        if (subcommand === "add") {
            if(!response[ctx.guild.id]){
                response[ctx.guild.id] = {
                    [trigger.toLowerCase()]: reaction
                };
            } else {response[ctx.guild.id][trigger.toLowerCase()] = reaction;}        	
            fs.writeFile("./database/reactions.json", JSON.stringify(response, null, 2), (err) => {
                if (err) console.log(err);
            }); 
            interaction.editReply({ embeds: [util.embed()
                .addField("Trigger", trigger)
                .addField("Response", reaction)
                .setAuthor("Reaction Added", ctx.client.user.displayAvatarURL())		
                .setThumbnail(ctx.guild.iconURL)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        } else if (subcommand === "remove") {
            if (!response[ctx.guild.id][trigger.toLowerCase()]) 
                return interaction.editReply({ embeds: [util.embed().setDescription("❌ | This Trigger doesn't exist.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()] });
            delete response[ctx.guild.id][trigger.toLowerCase()];       	
            fs.writeFile("./database/reactions.json", JSON.stringify(response, null, 2), (err) => {
                if (err) console.log(err);
            });  
            interaction.editReply({ embeds: [util.embed()
                .addField("Reaction was trigger by", trigger)
                .setAuthor("Reaction Removed", ctx.client.user.displayAvatarURL())		
                .setThumbnail(ctx.guild.iconURL)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        }
    }
};


