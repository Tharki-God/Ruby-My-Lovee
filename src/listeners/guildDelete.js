const util = require("../util");
module.exports = {
    name: "guildDelete",
    exec: async (client, guild) => {		
        client.logger.info(`${client.user.tag} has left ${guild.name}`);
        let owner = await guild.fetchOwner();   
        owner.user.send({ embeds: [util.embed().setDescription(`Thanks you For Your Time
Thanks for your Support(0.5%)
See ya Then IG
If you stopped using me because of Some **bug** the Report it to: **<@!${process.env.OWNER_ID}>**`)
            .setAuthor("Thanks for Having me **ONCE**", guild.iconURL({ dynamic: true }), `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`)
            .setFooter(client.user.username,  client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()]});
    }
};

