const util = require("../../util");
const bugReportChannelId = "828686427423637624";
const { MessageButton, MessageActionRow} = require("discord.js");
module.exports = {
    name: "report",
    aliases: ["send", "//", "shit"],
    usage: "report [Message]",
    level: "Info",
    examples: ["report Dev is Gay"],
    description: "A command used to send bugs to dev",
    exec: async (ctx) => {   
        let owner = await ctx.guild.fetchOwner();  
        const { args } = ctx;   
        if (ctx.guild.purge) ctx.msg.delete();
        const reportChannel = ctx.client.channels.cache.get(bugReportChannelId);
        if (!reportChannel)
            return ctx.msg.reply({ content: "The bugReportChannelId property has not been set"}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!args[0]) return ctx.msg.reply({ embeds: [util.embed().setDescription("Please provide a Message to send")
            .setFooter(ctx.member.displayName, ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()], allowedMentions: { repliedUser: false } }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        let report = ctx.msg.content.slice(ctx.msg.content.indexOf(args[0]), ctx.msg.content.length);
        let invite = await ctx.channel.createInvite({ maxAge: 0, maxUses: 0 });
        // Send report
        const reportEmbed = util.embed()
            .setTitle("Bug Report")
            .setURL(invite.url)
            .setThumbnail(reportChannel.guild.iconURL({ dynamic: true }))
            .setDescription(report)
            .addField("User", `<@!${ctx.member.user.id}>`, true)
            .addField("Server", ctx.guild.name, true)
            .setFooter(ctx.member.displayName, ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        reportChannel.send({ embeds: [reportEmbed],
            components:
                     [
                         new MessageActionRow()
                             .addComponents(
                         
                                 new MessageButton()
                                     .setURL(invite.url)
                                     .setLabel("Join Server")
                                     .setEmoji("❎")
                                     .setStyle("LINK"),
                             )
                     ]});
        // Send response
        if (report.length > 1024) report = report.slice(0, 1021) + "...";
        const embed = util.embed()
            .setTitle("Bug Report")
            .setThumbnail(owner.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`\`\`\`
Successfully sent bug report!
Please join the Support Server to further discuss your issue.\`\`\``)
            .addField("Member", `<@!${ctx.member.user.id}>`, true)
            .addField("Message", report)
            .setFooter(ctx.member.displayName, ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        ctx.channel.send({ embeds: [embed],
            components:
                     [
                         new MessageActionRow()
                             .addComponents(
                                 new MessageButton()
                                     .setURL("https://discord.com/invite/cDE6Trv8yM")
                                     .setLabel("Support Server")
                                     .setEmoji("🆘")
                                     .setStyle("LINK"),
                             )
                     ], allowedMentions: { repliedUser: false } }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});
    }
};

