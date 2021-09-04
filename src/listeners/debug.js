module.exports = {
    name: "debug",
    exec: async (client, info) => {
        client.logger.debug(info);
    }
};