const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "setchannel",
    aliases: ["channel", "cha", "lock"],
    usage: "channel [mention channel]",
    examples: ["channel #music"],
    level: "Admin",
    description: [`Set a channel only in  which the commands can be used. 
    Stop Those suckers to Use command in wrong channel
  (¬‿¬)`],
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let channels = JSON.parse(fs.readFileSync("./database/channels.json", "utf8"));
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.msg.mentions.channels.first() || ctx.msg.mentions.channels.first().type !== "GUILD_TEXT")
            return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Need to Provide a Channel.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        channels[ctx.guild.id] = {
            channel: ctx.msg.mentions.channels.first().id
        };	
        fs.writeFile("./database/channels.json", JSON.stringify(channels, null, 2), (err) => {
            if (err) console.log(err);
        }); 
        ctx.channel.send({ embeds: [util.embed()
            .setTitle("*Channel Locked*")
            .setDescription(`Now the Bot will Only Listen in ${ctx.msg.mentions.channels.first()}`)
            .setAuthor(ctx.guild.name, ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};