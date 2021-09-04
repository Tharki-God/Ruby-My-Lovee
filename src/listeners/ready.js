
module.exports = {
    name: "ready",
    exec: async (client) => {
        let owner = await client.users.fetch(process.env.OWNER_ID);
        const activities = [
            `Bot by: ${owner.username}#${owner.discriminator}`,
            "My Developer Die of Heart Attack"
        ];	
        client.logger.info(`Logged in as ${client.user.tag}`);
        client.logger.info(`Being used in ${client.guilds.cache.size} Servers`);
        client.logger.info(`Having ${client.cmds.size} Commands`);
        client.logger.info(`Having ${client.Scmds.size} Slash Commands`);
        client.logger.silly("Lets Have Some Fun");        
        let i = 6;
        setInterval(() => client.user.setActivity(`${activities[i++ % activities.length]}`, { type: "WATCHING" }), 7500);
        client.user.setStatus("idle"); 
        if (client.spotify) await client.spotify.requestToken();
    }
};