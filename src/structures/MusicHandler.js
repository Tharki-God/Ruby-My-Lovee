const util = require("../util");
const fs = require("fs");
let pussy;
let nope;

module.exports = class MusicHandler {
    /** @param {import("discord.js").Guild} guild */
    constructor(guild) {
        this.guild = guild;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.loop = 0;
        this.filters = {
            doubleTime: false,
            nightcore: false,
            vaporwave: false,
            "8d": false,
            bassboost: false
        };
        this.bassboost = 0;
        /** @type {import("discord.js").TextChannel|null} */
        this.textChannel = null;
        this.shouldSkipCurrent = false;
        this.state = null;
    }

    get voiceChannel() {
        return this.guild.me.voice.channel;
    }

    /** @returns {import("../structures/MusicClient")} */
    get client() {
        return this.guild.client;
    }

 
    get player() {
        return this.client.shoukaku.players.get(this.guild.id);
    }

    get node() {
        return this.client.shoukaku.nodes.get("None");
    }
    
    get volume() {
        return this.player?.filters.volume * 100 ?? 100;
    }
	
	
	

    reset() {
        this.loop = 0;
        this.previous = null;
        this.current = null;
        this.queue = [];
        this.textChannel = null;
        for (const filter of Object.keys(this.filters)) {
            this.filters[filter] = false;
        }
        this.bassboost = 0;
        this.state = null;
        this.track = null;
    }

    /** @param {import("discord.js").VoiceChannel} voice */
    async join(voice) {
        if (this.player) return;
        await this.node.joinChannel({
            channelId: voice.id,
            guildId: this.guild.id,
            shardId: this.guild.shardId,
            deaf: true,
            mute:false
        });

        this.player
            .on("start", async () => {
                this.current = this.queue.shift();
                let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
                if(!messageez[this.guild.id]){
                    messageez[this.guild.id] = {
                        ID: pussy
                    };
                }
                let last  = messageez[this.guild.id].ID;                
                let time;
                let volve;
            if (this.guild.me.voice.serverMute) {
                if (this.guild.me.hasPermission("MUTE_MEMBERS"))
               {this.guild.me.voice.setMute(false)} else {
                if (!this.textChannel.permissionsFor(this.guild.me).has('SEND_MESSAGES')) return;
                this.textChannel.send(util.embed().setDescription(`❌ | I am Server Muted. Either Give me Mute Members perms or Unmute me yourself.`)			
               .setFooter(this.current.requester.username,  this.current.requester.displayAvatarURL({ dynamic: true }))
               .setTimestamp())}
            }
            if (!this.textChannel.permissionsFor(this.guild.me).has('SEND_MESSAGES')) return;
                if (!this.current.info.isStream) { time = `${util.millisToDuration(this.current.info.length)} Mins`; } else if (this.current.info.isStream) {time= "**N/A | Live**<a:source:845082952303771658>"; }
                const modes = ["None", "Single Track", "Queue"];
                if (this.volume <= 0) {volve = `🔇 | ${this.volume}%`;} else if (101 <= this.volume) {volve = `🔊 | ${this.volume}%`;} else {volve = `💬 | ${this.volume}%`;} 
                nope = util.embed()
                    .setTitle(`**${this.current.info.title}**.`)
                    .setURL(`${this.current.info.uri}`)
                    .addField("Artist", this.current.info.author, true)		
                    .addField("Duration", time, true)
                    .addField( "\u200B", "\u200B", true)
                    .addField("Volume", volve, true)			
                    .addField("Looping", modes[this.loop], true)
                    .addField( "\u200B", "\u200B", true)	
                    .setAuthor("🎶 | Now playing" , this.client.user.displayAvatarURL(), "https://www.youtube.com/watch?v=dQw4w9WgXcQ")				
                    .setFooter(this.current.requester.username, this.current.requester.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();
		
                if (this.previous && this.previous !== this.current) {nope.addField("Previously Played", `[${this.previous.info.title}](${this.previous.info.uri})`, true);}
                if (this.queue[0]) {
                    nope.addField("Next to Play", `[${this.queue[0].info.title}](${this.queue[0].info.uri})`, true);}


                if (util.isYoutube(this.current.info.uri)) {nope.setThumbnail(`https://img.youtube.com/vi/${this.current.info.identifier}/0.jpg`);} 
                else if 
                (!util.isYoutube(this.current.info.uri) && !util.isSpotify(this.current.info.uri)) {
                    nope.setThumbnail(`https://media.discordapp.net${this.current.info.uri.split("https://cdn.discordapp.com")[1]}?format=jpeg`);
                }
                else if (util.isSpotify(this.current.info.uri))
                { var { getData } = require("spotify-url-info");
                    const spotify = await getData(this.current.info.uri);
                    nope.setThumbnail(spotify.album.images[0].url);}	
                let plymsg;
                if (Number(last)) {plymsg =  await this.textChannel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
                if (this.textChannel && !plymsg) { 
                    const playerMsg = await this.textChannel.send({embeds:[nope]});
                    pussy = playerMsg.id;
                    util.controls(playerMsg);				
                    messageez[this.guild.id] = {
                        ID: pussy
                    };	
                    fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                        if (err) this.client.logger.error(err.stack);
                    });} else if (this.textChannel && plymsg) { await plymsg.edit({embeds:[nope]}).catch(err => this.client.logger.error(err.stack)); }
            })
            .on("end", async (data) => {					
                if (data.reason === "REPLACED") return;
                this.previous = this.current;
                if (this.loop === 1 && !this.shouldSkipCurrent) this.queue.unshift(this.previous);
                else if (this.loop === 2) this.queue.push(this.previous);
                if (this.shouldSkipCurrent) this.shouldSkipCurrent = false;
                let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));
				
                if(!messageez[this.guild.id]){
                    messageez[this.guild.id] = {
                        ID: pussy
                    };
                }
                let last  = messageez[this.guild.id].ID;
                let status = JSON.parse(fs.readFileSync("./database/420.json", "utf8"));
                let plymsg;
                if (Number(last)) {plymsg =  await this.textChannel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
                if(!status[this.guild.id]){
                    status[this.guild.id] = {
                        info: false
                    };
                }

                let toogle  = status[this.guild.id].info;
                if (!this.queue.length) {
                    this.player.track = null;
                    if (!toogle) 
                    {
                        setTimeout(() => { 
                            if (!this.queue.length && this.player && !this.player.track)  
                                if (plymsg) {                       
                                    plymsg.edit({embeds:[util.embed().setDescription("Nothing was Played So I left, Let me Stay Forever by Using 24/7 Command.")
                                        .setAuthor("🈵 | I am no More" , this.client.user.displayAvatarURL())
                                        .setFooter(this.guild.name, this.guild.iconURL({ dynamic: true }))
                                        .setTimestamp()]}),
                                    plymsg.reactions.removeAll();
                                    if (this.guild.purge)  {messageez[this.guild.id] = {
                                        ID: ""
                                    };	
                                    fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                                        if (err) this.client.logger.error(err.stack);
                                    });}
                                    if (this.guild.purge) setTimeout(() => plymsg.delete(), 25000);	}                                                              
                            this.node.leaveChannel(this.guild.id); 
                            this.reset();      
                        }, 2700000); 
                    }
                    
                     
                    if (plymsg) {
                        plymsg.edit({embeds:[util.embed().setDescription(`I Am Waiting at ${this.guild.me.voice.channel}...`)
                            .setAuthor("✅ | Queue is empty" , this.client.user.displayAvatarURL())
                            .setFooter(this.guild.name, this.guild.iconURL({ dynamic: true }))
                            .setTimestamp()]});
                        if (this.guild.purge && toogle)  {
                            plymsg.reactions.removeAll();
                            messageez[this.guild.id] = {
                                ID: ""
                            };	
                            fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                                if (err) this.client.logger.error(err.stack);
                            });}
                        if (this.guild.purge && toogle) setTimeout(() => plymsg.delete(), 10000);
                        
                    }	
                    this.client.logger.info(`${this.client.user.username}: Queue Completed Of ${this.guild.name}`);			
                    return;
			
                }
                this.start();
            })
            .on('exception', (e) => {
                this.client.logger.error(e.error);
                this.textChannel.send({ embeds: [util.embed()
                    .setAuthor(' | Something went wrong with playing the Track', this.client.user.displayAvatarURL(), 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
                    .setDescription(`Track - [${this.current.info.title}](${this.current.info.uri})\nReason - ${e ? e.error : 'No Reason'}`)
                    .setFooter(this.current.requester.username,  this.current.requester.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            })
            .on('closed', async (data) => {
                console.log(data)
                if (data.code === 4014) return this.destroy();
            })
            .on("update", ({ state }) => {
                this.state = state;
            })
            .on("error", (e) => {             
                this.client.logger.error(e.error);
                this.destroy();
            });
    }

    /** @param {import("discord.js").TextChannel} text */
    setTextCh(text) {
        this.textChannel = text;
    }

    async load(query) {
        const spotify = await this.client.spotify.getNode(this.node.name);
        if (this.client.spotify.isValidURL(query)) {
            const { loadType: type, tracks, playlistInfo: { name } } = await spotify.load(query);
            return {
                type,
                tracks,
                playlistName: name
            };
        }
        return this.node.rest.resolve(query);
    }

    start() {
        this.current = null;
        this.player?.playTrack(this.queue[0].track);
    }
   

    pause() {
        if (!this.player?.paused) this.player?.setPaused(true);
    }

    resume() {
        if (this.player?.paused) this.player?.setPaused(false);
    }

    skip(to = 1) {
        if (to > 1) {
            this.queue.unshift(this.queue[to - 1]);
            this.queue.splice(to, 1);
        }
        if (this.loop === 1 && this.queue[0]) this.shouldSkipCurrent = true;
        this.player?.stopTrack();
    }

    stop() {
        this.loop = 0;
        this.queue = [];
        this.skip();
    }

    setVolume(volume) {
        this.player?.setVolume(volume / 100);
    }

    setDoubleTime(val) {
        if (!this.player) return;
        this.filters.doubleTime = val;
        if (val) {
            this.filters.nightcore = false;
            this.filters.vaporwave = false;
        }
        this.player.setTimescale(val ? { speed: 1.5 } : null);
    }

    setNightcore(val) {
        if (!this.player) return;
        this.filters.nightcore = val;
        if (val) {
            this.filters.doubleTime = false;
            this.filters.vaporwave = false;
        }
        this.player.setTimescale(val ? { rate: 1.5 } : null);
    }

    setVaporwave(val) {
        if (!this.player) return;
        this.filters.vaporwave = val;
        if (val) {
            this.filters.doubleTime = false;
            this.filters.nightcore = false;
        }
        this.player.setTimescale(val ? { pitch: 0.5 } : null);
    }

    set8D(val) {
        if (!this.player) return;
        this.filters["8d"] = val;
        this.player.setRotation(val ? { rotationHz: 0.2 } : null);
    }

    setBassboost(val) {
        if (!this.player) return;
        this.filters.bassboost = !!val;
        this.bassboost = val / 100;
        this.player.setEqualizer(val ? Array(6).fill(0.22).map((x, i) => ({ band: i, gain: x * val })) : []);
    }
};
