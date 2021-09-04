const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "setprefix",
    aliases: ["prefix", "pre"],
    usage: "prefix [Anything]",
    examples: ["prefix m!"],
    level: "Admin",
    description: [`Chnages The Prefix of Meraki Bot.
  Can be Used By: Server Owner and Admins Only (Bot Owner Also)
  (¬‿¬)`],
    exec: async (ctx) => {
        const { args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        let prefixes = JSON.parse(fs.readFileSync("./database/prefixes.json", "utf8"));
        if(!prefixes[ctx.guild.id]){
            prefixes[ctx.guild.id] = {
                prefix: process.env.PREFIX
            };
        }
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!args[0]) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Need to Provide a Prefix.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        prefixes[ctx.guild.id] = {
            prefix: args[0].toLowerCase()
        };	
        fs.writeFile("./database/prefixes.json", JSON.stringify(prefixes, null, 2), (err) => {
            if (err) console.log(err);
        });  
        ctx.channel.send({ embeds: [util.embed()
            .setTitle("*Prefix Changed*")
            .setDescription(`The Prefix is Now **${args[0].toUpperCase()}**`)
            .setAuthor(`${ctx.guild.name} Prefix`, ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};


