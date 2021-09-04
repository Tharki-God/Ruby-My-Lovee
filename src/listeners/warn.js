module.exports = {
    name: "warn",
    exec: async (client, info) => {
        client.logger.warn(info);
    }
};