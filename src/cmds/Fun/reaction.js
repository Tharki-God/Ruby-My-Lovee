const util = require("../../util");
const fs = require("fs");
let trigger;
const { Permissions } = require("discord.js");
module.exports = {
    name: "react",
    aliases: ["trigger", "send", "response"],
    usage: "reaction [Trigger] [Response]",
    examples: ["react Jaat Danger is here"],
    level: "Fun",
    description: [`Add A trigger and response
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
        if (!args[0] && !args[1]) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Need to Provide a Trigger and response.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        trigger = args.shift().toLowerCase();

        if(!response[ctx.guild.id]){
            response[ctx.guild.id] = {
                [trigger]: args.join(" ")
            };
        } else {response[ctx.guild.id][trigger] = args.join(" ");}        	
        fs.writeFile("./database/reactions.json", JSON.stringify(response, null, 2), (err) => {
            if (err) console.log(err);
        }); 
        ctx.channel.send({ embeds: [util.embed()
            .addField("Trigger", trigger)
            .addField("Response", args.join(" "))
            .setAuthor("Reaction Added", ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};


