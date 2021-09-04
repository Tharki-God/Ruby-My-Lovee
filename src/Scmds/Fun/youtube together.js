const util = require("../../util");
const { DiscordTogether } = require("discord-together");
const { MessageButton, MessageActionRow, Permissions} = require("discord.js");
module.exports = {
    name: "youtube",
    level: "Fun",
    type: "CHAT_INPUT",
    options: [
        {
            name: "together",
            description: "Starts Yotube Together.",
            type:"SUB_COMMAND",
            options:[{
                name: "channel",
                description: "Set channel for youtube together.",
                type:"CHANNEL",
                required:false,
            }]
        }
    ],
    description: "Starts Yotube Together.",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        ctx.client.discordTogether = new DiscordTogether(ctx.client);
        const channelId = args[1];
        const channel = await ctx.guild.channels.cache.get(channelId);
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS]) && ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return interaction.editReply({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
        if (!ctx.member.voice.channel && !channel)
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | You must Provide a voice channel. (Or Join one and then use this command.)")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        if (!ctx.member.voice.channel && channel.type !== "GUILD_VOICE") return interaction.editReply({embeds:[util.embed()
            .setFooter("Are you Dumb or What?.\n" + ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("You Need to Proivde a Voice Channel. Thats the only Way")	
            .setTimestamp()]});

        ctx.client.discordTogether.createTogetherCode(channelId ? channelId : ctx.member.voice.channel.id , "youtube").then(async invite => {
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
        return interaction.editReply({embeds:[util.embed()
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Youtube Together Session Created")	
            .setTimestamp()], ephemeral: false });  
    }
};
