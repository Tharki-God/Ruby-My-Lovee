const api = require("express").Router();
const { join } = require("path");
const fs = require("fs");
const categories = fs.readdirSync(join(__dirname, "..", "cmds"));
let Commands = [];
categories.forEach(x => {
    let CommandsDir = join(__dirname, "..", "cmds", x);    
    fs.readdir(CommandsDir, (err, files) => {
        if (err) this.logger.info(err);
        else
            files.forEach((file) => {
                let cmd = require(CommandsDir + "/" + file);
                if (!cmd.name || !cmd.description || !cmd.exec) return;          
                Commands.push({
                    name: cmd.name,
                    aliases: cmd.aliases,
                    level:cmd.level,
                    usage: cmd.usage,
                    description: cmd.description
                });
            });
    });
});

api.get("/", (req, res) => {
    res.sendFile(join(__dirname, "..", "views", "index.html"));
});
api.get("/donate", (req, res) => {
    res.sendFile(join(__dirname, "..", "views", "donate.html"));
});

api.get("/api/commands", (req, res) => {
    res.send({ commands: Commands });
});

module.exports = api;
