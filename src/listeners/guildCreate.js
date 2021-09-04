const util = require("../util");
module.exports = {
    name: "guildCreate",
    exec: async (client, guild) => {		
        client.logger.info(`${client.user.tag} has joined ${guild.name}`);
        let defaultChannel;
        guild.channels.cache.forEach((channel) => {
            if(channel.type == "text" && !defaultChannel) {
                if(channel.permissionsFor(guild.me).has(["SEND_MESSAGES", "VIEW_CHANNEL", "EMBED_LINKS"])) {
                    defaultChannel = channel;
                }
            }
        });
        defaultChannel.send({ embeds: [util.embed().setDescription(`**-** Use **${process.env.PREFIX}help** (or **<@!${client.user.id}>help**) to view all of my commands
**-** You can change my prefix from **${process.env.PREFIX}** by using **${process.env.PREFIX}SETPREFIX**
**-** If you need more help, please feel free to Ask the Dev **<@!${process.env.OWNER_ID}>**

▬▬▬▬▬▬▬▬▬▬▬▬▬

🈚: **Freemium**
Everything you get for free: 

**-** 24/7 Access
**-** Volume control
**-** Reaction Commands
**-** and more.

Feel Free To Donate to Dev in form of **Nitros**: **<@!${process.env.OWNER_ID}>**`)
            .setAuthor("Thanks for Having me", guild.iconURL({ dynamic: true }), "https://genoanime.com/")
            .setFooter(client.user.username,  client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]}).then(msg => {if (msg.guild.purge)  msg.delete({ timeout: 1000000 });}).catch(err => client.logger.error(err.message));

    }};


