const { MessageEmbed, Permissions, MessageActionRow, MessageButton} = require("discord.js");
const prettyMilliseconds = require("pretty-ms");
const { porgressBar } = require("music-progress-bar");

class Util {
   
    static embed() {
        return new MessageEmbed()
            .setColor("#FF0000");
    }

    static durationToMillis(dur) {
        return dur.split(":").map(Number).reduce((acc, curr) => curr + acc * 60) * 1000;
    }

    static millisToDuration(ms) {
        return prettyMilliseconds(ms, { colonNotation: true, secondsDecimalDigits: 0 });
    }

    static chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    static isValidURL(url) {
        return /^https?:\/\/((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
            .test(url);
    }
    
    static shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    static get paginationEmojis() {
        return ["⏮", "◀", "⛔", "▶", "⏭"];
    }

    static async pagination(msg, author, contents, type, currPage = 0) {
        /** @type {import("discord.js").InteractionCollector} */
        const collector = msg.createMessageComponentCollector({
            filter: interaction => this.paginationEmojis.includes(interaction.customId),
            componentType: "BUTTON",
            max: 1,
            time: 30000
        });

        collector
            .on("collect", async (interaction) => {
                await interaction.deferUpdate();
                if (interaction.user.id === author.id) {
                const emoji = interaction.customId; 
                if (emoji === this.paginationEmojis[0]) (currPage = 0);
                if (emoji === this.paginationEmojis[1]) currPage--;
                if (emoji === this.paginationEmojis[2]) {
                    await interaction.editReply({ components: [new MessageActionRow().addComponents(...interaction.message.components[0].components.map(x => x.setDisabled(true)))] });
                    return;
                }
                if (emoji === this.paginationEmojis[3]) currPage++;
                if (emoji === this.paginationEmojis[4]) (currPage = (contents.length - 1));
                currPage = ((currPage % contents.length) + contents.length) % contents.length;
                if (type === "queue"){
                    const music = interaction.client.musics.get(interaction.guild.id);
                    const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);      
                    const ilive = music.queue.some(track => track.info.isStream);
                    const embed = interaction.message.embeds[0]
                        .setAuthor(` |  ${interaction.guild.name} Music Queue`, interaction.guild.iconURL({ dynamic: true }))      
                        .setThumbnail("https://cdn.discordapp.com/attachments/879114142458478603/879114169813708860/thumb-1920-1010992.png")
                        .setImage("https://cdn.discordapp.com/attachments/879114142458478603/879114878013550612/e0b.gif")      
                        .setDescription(`🔊 Now Playing: \n${music.current.info.isStream ? "[**Live**<a:source:845082952303771658>]" : ""}[${music.current.info.title}](${music.current.info.uri}) [${music.current.info.isStream ? "Ask the Streamer how much left :)" : this.millisToDuration(music.current.info.length - music.player.position)} Left]\n${music.current.info.isStream ? "" : `${porgressBar({currentPositon:music.player.position /1,endPositon:music.current.info.length,width:16,barStyle:"=",currentStyle:"🔘"}, {format:" [ <bar> ] <precent> <%>"})}`}\n🔊Up Next:\n${contents == "" ? " No other tracks here" : "" + contents[currPage]}`)    
                        .setFooter(`Page ${currPage + 1}/${contents.length === 0 ? "1" : contents.length} | Track's in Queue: ${queue.length === 0 ? "1" :queue.length} | ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN": `Total Length: ${this.millisToDuration(music.queue.reduce((prev, curr) => prev + curr.info.length, 0) + (music.current.info.length - music.player.position))}`}`);
                
                    await interaction.editReply({
                        embeds: [embed],
                        components:
                    contents.length > 1
                        ? [
                            new MessageActionRow()
                                .addComponents(
                                    ...this.paginationEmojis.map((x, i) =>
                                        new MessageButton()
                                            .setCustomId(x)
                                            .setEmoji(x)
                                            .setStyle(i === 2 ? "DANGER" : "SUCCESS")
                                    )
                                )
                        ]
                        : []
                    });} else if (type === "lyrics"){
                       
                    const nah = interaction.message.embeds[0]     
                        .setDescription(contents[currPage])    
                        .setFooter(`Page ${currPage + 1} of ${contents.length}.`, interaction.user.displayAvatarURL({dynamic:true}));
                    
                    await interaction.editReply({
                        embeds: [nah],
                        components:
                        contents.length > 1
                            ? [
                                new MessageActionRow()
                                    .addComponents(
                                        ...this.paginationEmojis.map((x, i) =>
                                            new MessageButton()
                                                .setCustomId(x)
                                                .setEmoji(x)
                                                .setStyle(i === 2 ? "DANGER" : "SUCCESS")
                                        )
                                    )
                            ]
                            : []
                    });}
                } else {await interaction.channel.send({
                    embeds: [this.embed().setDescription("❌ | Bitch Those buttons Ain't for you.")			
                    .setFooter(interaction.user.username,  interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]                
                });}
                this.pagination(msg, author, contents, type, currPage);
            } 
            )
            .on("end", (collected, reason) => {
                if (reason === "time" || collected.first()?.customId === this.paginationEmojis[2]) msg.edit({
                    components: [
                        new MessageActionRow()
                            .addComponents(...msg.components[0].components.map(x => x.setDisabled(true)))
                    ]
                });
            });
    }

    static get controlsEmojis() {
        return ["⏪", "⏯", "⏩", "🔀", "➿", "🔉", "🔊", "⏹", "🩸"];
    }
    static async controls(msg, init = true) {
        if (init) for (const emoji of this.controlsEmojis) await msg.react(emoji);
        const music = msg.client.musics.get(msg.guild.id);
        const filter = (reaction, user) => {
            return this.controlsEmojis.includes(reaction.emoji.name) && user.id !== msg.client.user.id;
        };
        
        const collector =  msg.createReactionCollector({ filter});
    
        collector
            .on("collect", async (reaction, user) => {	
                const { readFileSync } = require("fs");
                let messageez = JSON.parse(readFileSync("./database/messageez.json", "utf8"));
                let pussy;
                if(!messageez[msg.guild.id]){
                    messageez[msg.guild.id] = {
                        ID: pussy
                    };
                }
                let last  = messageez[msg.guild.id].ID;
                let plymsg;
                if (Number(last)) {plymsg =  await msg.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}		
                reaction.users.remove(user);
                const emoji = reaction.emoji.name;			
                if (!msg.guild.members.cache.get(user.id).voice.channel)
                    return msg.channel.send({ embeds: [this.embed().setDescription("❌ | You must be on a voice channel.")			
                        .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.guild.members.cache.get(user.id).voice.channel))
                    return msg.channel.send({ embeds: [this.embed().setDescription(`❌ | You must be on ${msg.guild.me.voice.channel} to use this command.`)			
                        .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
				
                if (emoji === this.controlsEmojis[0]) {
                    if (!music.previous) return; 
                    if (music.previous === music.current) return; 
                    music.queue.unshift(music.previous);
                    music.skip();
                    music.queue.unshift(music.previous);
                    msg.channel.send({ embeds: [this.embed().setDescription("⏮️ | Repeated")], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
                    return;}
                if (emoji === this.controlsEmojis[1]) {
                    if (!music.player.paused) {await music.pause();
                        if (plymsg){
                            const nah = plymsg.embeds[0];
                            nah.author.name = "🎶 | Now paused";  
                            plymsg.edit({embeds:[nah]});} return;}
                    if (music.player.paused) 
                    { await music.resume();
                        if (plymsg){
                            const nah = plymsg.embeds[0];
                            nah.author.name = "🎶 | Now Playing";  
                            plymsg.edit({embeds:[nah]});} return;}
                    return;}
                if (emoji === this.controlsEmojis[2]) {
                    if (!music.queue.length) return;
                    music.skip();
                    msg.channel.send({embeds:[this.embed().setDescription("⏭️ | Skipped")], ephemeral: true}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
                    return;}
                if (emoji === this.controlsEmojis[3]) {
                    if (!music.queue.length) return;
                    music.queue = this.shuffleArray(music.queue);
                    msg.channel.send({embeds:[this.embed().setDescription("✅ | Shuffled the Queue.")                                  
                        .setFooter(msg.author.username,  msg.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
                    return;}
                if (emoji === this.controlsEmojis[4]) {
                    const modes = ["None", "Single Track", "Queue"];
                    if (music.loop === 0) {
                        music.loop = 1;	
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[4] = { name: "Looping", value: modes[music.loop], inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });            
                        }	
                        return;}
                    else if (music.loop === 1) {	
                        music.loop = 2;
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[4] = { name: "Looping", value: modes[music.loop], inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });            
                        }
                        return;}
                    else if (music.loop === 2) {
                        music.loop = 0;
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[4] = { name: "Looping", value: modes[music.loop], inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });            
                        }
                        return;}}

                if (emoji === this.controlsEmojis[5]) {
                    if (music.volume == 0) return;
                    if (music.volume - 10 <= 0) { await music.setVolume(0); } else {await music.setVolume((music.volume - 10).toFixed(0));}
                    if (music.volume <= 0) {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `🔇 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                        
                        }
                        return;}
                    else if (101 <= music.volume) {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `🔊 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                            
                        }
                        return;
                    } else {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `💬 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                            
                        }
                        return;}	
                }
                if (emoji === this.controlsEmojis[6]) {
                    if (music.volume == 150) return;
                    if (music.volume + 10 >= 150) { await music.setVolume(150); } else {await music.setVolume((music.volume + 10).toFixed(0));}
                    if (music.volume <= 0) {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `🔇 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                            
                        }
                        return;}
                    else if (101 <= music.volume) {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `🔊 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                                
                        }
                        return;
                    } else {
                        if (plymsg) {               
                            const nah = plymsg.embeds[0];
                            nah.fields[3] = { name: "Volume", value: `💬 | ${music.volume.toFixed(0)}%`, inline: true };
                            await plymsg.edit({
                                embeds :[nah]
                            });
                                
                        }
                        return;}
                }

                if (emoji === this.controlsEmojis[7]) {
                    music.stop();
                    return;
                }
                if (emoji === this.controlsEmojis[8]) try {
                    let owner = await msg.guild.fetchOwner(); 
                    const {tracks} = await music.load("https://www.youtube.com/watch?v=dQw4w9WgXcQ");			
                    music.queue = [];
                    music.loop = 0;
                    const track = tracks[0];
                    track.requester = owner.user;
                    music.queue.push(track);  
                    await music.skip();	            
                    return;
                } catch (e) {
                    msg.client.logger.error(`An error occured: ${e.message}.`);		
			
                }
                this.controls(msg, false);
            })
		
            .on("end", (_, reason) => {
                if (["user"].includes(reason))  msg.reactions.removeAll();
            });
			
    }	

	
	

    /**
     * @param {import("discord.js").PermissionResolvable} memberPerms
     * @param {import("discord.js").PermissionResolvable} requiredPerms
     * @returns {import("discord.js").PermissionString[]}
     */
    static missingPerms(memberPerms, requiredPerms) {
        return new Permissions(memberPerms).missing(new Permissions(requiredPerms));
    }
    static moveArrayElement(arr, fromIndex, toIndex) {
        arr.splice(toIndex, 0, arr.splice(fromIndex, 1)[0]);
        return arr;
    }
    static progress(current, total, size = 16) {
        const percent = current / total * size;
        const progbar = new Array(size).fill("▬");
        progbar[Math.round(percent)] = "🔘";
        return {
            bar: progbar.join(""),
            percent
        };
    }

    static isYoutube(url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        if(url.match(p)){
            return url.match(p)[1];
        }
        return false;
    }
    static isSpotify(url) {
        var p = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track)(?::|\/)((?:[0-9a-zA-Z]){22})/;
        if(url.match(p)){
            return url.match(p)[1];
        }
        return false;
    }
    static async awaitSelection(msg, filter) {
        try {
            const selected = await msg.awaitMessageComponent(
                {   
                    filter,
                    time: 30000,
                    componentType: "SELECT_MENU"
                }
            );
            return selected;
        } catch {
            return null;
        }
    }
    
}

module.exports = Util;
