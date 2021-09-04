const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "unlock",
    aliases: ["nochannel", "chatu"],
    usage: "unlock",
    level: "Admin",
    description: [`Unlocks the bot to all channels if Locked to a certain channel
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
        if (!channels[ctx.guild.id].channel) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | I am already free. **Fuck off.")			
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        delete channels[ctx.guild.id].channel;	
        fs.writeFile("./database/channels.json", JSON.stringify(channels, null, 2), (err) => {
            if (err) console.log(err);
        }); 
        ctx.channel.send({ embeds: [util.embed()
            .setTitle("*Bot Unlocked*")
            .setDescription("Now the Bot is open to all the changes again.")
            .setAuthor(`${ctx.channel.name}`,ctx.client.user.displayAvatarURL())		
            .setThumbnail(ctx.guild.iconURL)
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});


    
    }
};

