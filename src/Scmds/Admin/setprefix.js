const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "setprefix",
    options:[{
        name: "prefix",
        description: "Perfix for the server~ even though you are using slash commands :).",
        type:"STRING",
        required:true,
    }],
    level: "Admin",
    type: "CHAT_INPUT",
    description: "Chnages The Prefix of Bot in server. Can be Used By: Server Owner and Admins Only (Bot Owner Also)" ,
    exec: async (ctx) => {
        const { interaction, args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));
        if(!prefixes[ctx.guild.id]){
            prefixes[ctx.guild.id] = {
                prefix: process.env.PREFIX
            };
        }
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
        return interaction.editReply({
            embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
        prefixes[ctx.guild.id] = {
            prefix: args[0].toLowerCase()
        };	
        fs.writeFile("./database/prefixes.json", JSON.stringify(prefixes, null, 2), (err) => {
            if (err) console.log(err);
        });  
        interaction.editReply({ embeds: [util.embed()
            .setTitle("*Prefix Changed*")
            .setDescription(`The Prefix is Now **${args[0].toUpperCase()}**`)
            .setAuthor(`${ctx.guild.name} Prefix`, ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
    }
};


