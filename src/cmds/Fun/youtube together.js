const util = require("../../util");
const { DiscordTogether } = require("discord-together");
const { MessageButton, MessageActionRow, Permissions} = require("discord.js");
module.exports = {
    name: "youtube",
    level: "Fun",
    aliases: ["watch", "together", "tube"],
    usage: "youtube <#channel>",
    examples: ["youtube #JaatZone"],
    description: "Starts Yotube Together.",
    exec: async (ctx) => {
        ctx.client.discordTogether = new DiscordTogether(ctx.client);
        const channel =  ctx.msg.mentions.channels.first();
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS]) && ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.member.voice.channel && !channel)
            return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You must Provide a voice channel. (Or Join one and then use this command.)")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!ctx.member.voice.channel && channel.type !== "GUILD_VOICE") return ctx.channel.send({embeds:[util.embed()
            .setFooter("Are you Dumb or What?.\n" + ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("You Need to Proivde a Voice Channel. Thats the only Way")	
            .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        ctx.client.discordTogether.createTogetherCode(ctx.msg.mentions.channels.first() ? ctx.msg.mentions.channels.first().id : ctx.member.voice.channel.id , "youtube").then(async invite => {
            return ctx.send({embeds:[util.embed()
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setDescription("Okay this is it. Click the button to join the session.")	
                .setTimestamp()],
            components:
                     [
                         new MessageActionRow()
                             .addComponents(
                                 new MessageButton()
                                     .setURL(invite.code)
                                     .setLabel("Join Session")
                                     .setStyle("LINK"),
                             )
                     ]
            });  
        }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 3600000);}});
        return ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Youtube Together Session Created")	
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});  
    }
};
