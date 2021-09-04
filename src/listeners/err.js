module.exports = {
    name: "err",
    exec: async (client, err) => {
        client.logger.error(err.stack);
    }
};