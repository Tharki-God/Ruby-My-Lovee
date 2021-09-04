module.exports = {
    name: "guildUpdate",
    exec: async (client, oldGuild, newGuild) => {	
        if (oldGuild.name == newGuild.name) return;	
        client.logger.info(`${oldGuild.name} server name changed to ${newGuild.name}`);
    }};


