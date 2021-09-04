const { Shoukaku, Libraries } = require("shoukaku");
const { Client, Collection } = require("discord.js");
const { promises: { readdir }, readdirSync } = require("fs");
const { join } = require("path");
const { LavasfyClient } = require("lavasfy");
const http = require("http");
const Express = require("express");


module.exports = class MusicClient extends Client {
    /** @param {import("discord.js").ClientOptions} [opt] */
    constructor(opt) {
        super(opt);
        this.server = Express();
        this.http = http.createServer(this.server);
        this.server.use("/", require("../api"));   
        this.logger = require("../logger.js"); 
        this.levels = {
            Info: "Info",
            Music: "Music",
            Misc: "Misc",
            Admin: "Admin",
            Owner: "Owner",
            Filters: "Filters",
            Fun: "Fun"
        };
        this.logger.info("Initializing...");
        this.musics = new Collection();
        this.cmds = new Collection();
        this.Scmds = new Collection();
        this.shoukaku = new Shoukaku(new Libraries.DiscordJS(this), [
            {
                name: "None",
                url: `${process.env.LAVA_HOST}:${process.env.LAVA_PORT}`,
                auth: process.env.LAVA_PASS,
                secure: true
            }
        ],
        { moveOnDisconnect: false, resumable: true, resumableTimeout: 60,reconnectInterval:1000, reconnectTries: 600, restTimeout: 60000 });
        this.spotify = process.env.ENABLE_SPOTIFY === "true"
            ? new LavasfyClient({
                clientID: process.env.SPOTIFY_ID,
                clientSecret: process.env.SPOTIFY_SECRET,
                playlistLoadLimit: process.env.SPOTIFY_PLAYLIST_PAGE_LIMIT,
                audioOnlyResults: true,
                useSpotifyMetadata: true,
                autoResolve: true
            }, [
                {
                    id: "None",
                    host: process.env.LAVA_HOST,
                    port: process.env.LAVA_PORT,
                    password: process.env.LAVA_PASS,
                    secure: true
                }
            ])
            : null;

        this.prefix = process.env.PREFIX.toLowerCase();
    }


    async  build() {
        await  this.login(process.env.TOKEN);
        this.loadcmds();
        this.loadScmds();
        this.server.listen(process.env.PORT, () => {
            this.logger.info(`Listening to requests on Port ${process.env.PORT}`);
        });
        this.loadEventListeners();        

        this.shoukaku
            .on("ready", (name, resumed) => this.logger.info(`${name} is now ready.${resumed ? " (Lavalink Reconnected Connection)": "(Lavalink New Connecttion)"}`))
            .on("disconnect", (name, players, moved) => this.logger.debug(`Lavalink ${name} disconnected.`, moved ? 'players have been moved' : 'players have been disconnected'))
            .on("close", (name, code, reason) => this.logger.error(`Lavalink ${name} closed. Code: ${code}. Reason: ${reason || 'No reason'}`))
            .on("error", (name, error) => this.logger.error(`Encountered an error in node ${name}.`, error.stack))
            .on("debug", (name, reason) => this.logger.debug(`${reason || 'No reason'} (${name})`));
        
        process.on("unhandledRejection", error => {
            if (error.code == "10008" || error.code == "10062") return;
            this.logger.error(error.stack);
        });
    }

    /** @private */
    async loadcmds() {
        this.logger.silly("Lodaing CMDS...");
        const ascii = require("ascii-table");
        let commands = [];
        let table = new ascii(`Commands | Prefix: ${process.env.PREFIX}`);
        table.setHeading("Command", "Aliases","Level", "Status");
        const categories = readdirSync(join(__dirname, "..", "cmds"));
        categories.forEach(x => {
            const cmds = readdirSync(join(__dirname, "..", "cmds", x)).filter(z => z.endsWith(".js"));
            for (let cmdFile of cmds) {
                const cmd = require(`../cmds/${x}/${cmdFile}`);
                if (cmd.name) {
                    this.cmds.set(cmd.name, cmd);
                    commands.push(cmd);
                    table.addRow(cmdFile,cmd.aliases,cmd.level,"🆗");}
                else {
                    table.addRow(cmdFile,cmd.aliases,cmd.level,"🈶");
                    continue;
                }                
            }
        });
        this.logger.silly(`  
${table.toString()}`);
        this.logger.silly(`Lodaded ${commands.length} Commands`);
        
    }
    /**   @private */
    async loadScmds() {
        this.logger.silly("Lodaing SLASH CMDS...");
        const ascii = require("ascii-table");
        let Scommands = [];
        let table = new ascii("Slash Commands");
        table.setHeading("Slash Command","Type" ,"Level", "Status");
        const categories = readdirSync(join(__dirname, "..", "Scmds"));
        categories.forEach(x => {
            const Scmds = readdirSync(join(__dirname, "..", "Scmds", x)).filter(z => z.endsWith(".js"));
            for (let ScmdFile of Scmds) {
                const Scmd = require(`../Scmds/${x}/${ScmdFile}`);
                if (Scmd.name) {
                    this.Scmds.set(Scmd.name, Scmd);
                    if (["MESSAGE", "USER"].includes(Scmd.type)) delete Scmd.description;
                    Scommands.push(Scmd);
                    table.addRow(ScmdFile,Scmd.type,Scmd.level,"🆗");}
                else {
                    table.addRow(ScmdFile,Scmd.type,Scmd.level,"🈶");
                    continue;
                }                
            }
        });
        this.logger.silly(`  
${table.toString()}`);
        this.logger.silly(`Lodaded ${Scommands.length} Slash Commands`);     
          
        await this.guilds.cache.get("766131882765058108")?.commands.set(Scommands);
        // await client.application.commands.set(Scommands);
    }

    /** @private */
    async loadEventListeners() {
        this.logger.silly("Lodaing Events...");
        const listeners = await readdir(join(__dirname, "..", "listeners"));
        for (const listenerFile of listeners) {
            const listener = require(`../listeners/${listenerFile}`);
            this.on(listener.name, (...args) => listener.exec(this, ...args));
        }
       
    }
    
   
};

