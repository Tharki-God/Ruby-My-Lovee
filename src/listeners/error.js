module.exports = {
    name: "error",
    exec: async (client, error) => {
        client.logger.error(error.stack);
    }
};