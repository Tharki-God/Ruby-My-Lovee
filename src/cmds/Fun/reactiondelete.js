const util = require("../../util");
const fs = require("fs");
let trigger;
const { Permissions } = require("discord.js");
module.exports = {
    name: "unreact",
    aliases: ["untrigger", "disend", "unresponse"],
    usage: "reaction [Trigger]",
    examples: ["react Jaat"],
    level: "Fun",
    description: [`Stops the auto response 
  (¬‿¬)`],  
    exec: async (ctx) => {
        const { args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        let response = JSON.parse(fs.readFileSync("./database/reactions.json", "utf8"));
        if (!ctx.msg.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && ctx.msg.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        trigger = args[0].toLowerCase();
        if (!trigger) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Need to Provide the Trigger.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        if (!response[ctx.guild.id][trigger]) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | This Trigger doesn't exist.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        delete response[ctx.guild.id][trigger];       	
        fs.writeFile("./database/reactions.json", JSON.stringify(response, null, 2), (err) => {
            if (err) console.log(err);
        });  
        ctx.channel.send({ embeds: [util.embed()
            .addField("Reaction was trigger by", trigger)
            .setAuthor("Reaction Removed", ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});


        
    }

};
