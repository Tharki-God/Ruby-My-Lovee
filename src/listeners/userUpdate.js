module.exports = {
    name: "userUpdate",
    exec: async (client, oldUser, newUser) => {	
        if (oldUser.tag === newUser.tag) return;	
        client.logger.info(`${oldUser.tag} user tag changed to ${newUser.tag}`);	
    }
};

