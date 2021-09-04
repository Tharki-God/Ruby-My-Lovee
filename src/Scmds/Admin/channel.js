const util = require("../../util");
const fs = require("fs");
const { Permissions } = require("discord.js");
module.exports = {
    name: "channel",
    level: "Admin",
    type: "CHAT_INPUT",
    options: [
        {
            name: "lock",
            description: "Add A trigger and response",
            type:"SUB_COMMAND",
            options:[{
                name: "channel",
                description: "Locks the bot the the specified channel.",
                type:"CHANNEL",
                required:true,
            }]
        },
        {
            name: "unlock",       
            description: "Unlocks the bot to all channels if Locked to a certain channel",
            type:"SUB_COMMAND",
        },

    ],
    description: "Used to Lock or unlock the bot from a channel",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const[subcommand, channelId] = args;
        let channels = JSON.parse(fs.readFileSync("./database/channels.json", "utf8"));
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
        return interaction.editReply({
            embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        });
        if (subcommand === "lock") {
            const channel = await interaction.guild.channels.cache.get(channelId);
            if (channel.type !== "GUILD_TEXT")
                return interaction.editReply({ embeds: [util.embed().setDescription("❌ | You Need to Provide a Text Channel.")
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()] });
            channels[ctx.guild.id] = {
                channel: channelId
            };	
            fs.writeFile("./database/channels.json", JSON.stringify(channels, null, 2), (err) => {
                if (err) console.log(err);
            }); 
            interaction.editReply({ embeds: [util.embed()
                .setTitle("*Channel Locked*")
                .setDescription(`Now the Bot will Only Listen in ${channel}`)
                .setAuthor(ctx.guild.name, ctx.client.user.displayAvatarURL())		
                .setThumbnail(ctx.guild.iconURL)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        }
        else if (subcommand === "unlock") {
            if (!channels[ctx.guild.id].channel) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | I am already free. **Fuck off.")			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });

            delete channels[ctx.guild.id].channel;	
            fs.writeFile("./database/channels.json", JSON.stringify(channels, null, 2), (err) => {
                if (err) console.log(err);
            }); 
            interaction.editReply({ embeds: [util.embed()
                .setTitle("*Bot Unlocked*")
                .setDescription("Now the Bot is open to all the changes again.")
                .setAuthor(`${ctx.channel.name}`,ctx.client.user.displayAvatarURL())		
                .setThumbnail(ctx.guild.iconURL)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        }

    
    }
};

