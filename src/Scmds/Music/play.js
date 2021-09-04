const util = require("../../util");
const fs = require("fs");
module.exports = {
    name: "play",
    level: "Music",
    type: "CHAT_INPUT",
    options: [{
        name: "song",
        description: "Song Link or Name.",
        type:"STRING",
        required:true,
    }],
    description: "Plays the Link or Search and play the song name.",
    exec: async (ctx) => {
        const{music, interaction, args} = ctx;
        const[query] = args;
        let pussy;
        let total;
        let remin;
        let uptocome;
        let time;
        let owner = await ctx.guild.fetchOwner();  
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        if (!ctx.member.voice.channel)
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return interaction.editReply({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player?.track) && missingPerms.length)
            return interaction.editReply({ embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });

        if (music.node?.state !== 1)
            return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Lavalink node is not connected yet.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] });
        try {
            const result =  await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!result || !result.tracks.length) return interaction.editReply({
                embeds: [util.embed().setDescription("❌ | Couldn't find any results.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
            const { type, playlistName, tracks } = result;
            const ilive = music.current ? music.current.info.isStream ? true : music.queue.some(track => track.info.isStream) : false; 
            if (type === "PLAYLIST_LOADED" || type === "PLAYLIST") {
                for (const track of tracks) {
                    track.requester = ctx.author;
                    if (music &&  music.player && music.player.track && !music.queue[0]) {
                        const plymsg = await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});
                        if (plymsg) { 
                            if (plymsg.embeds)
                            {const nah = plymsg.embeds[0];                           
                                nah.addField("Next to Play", `[${track.info.title}](${track.info.uri})`, true); 
                                plymsg.edit({
                                    embeds: [nah]
                                });}               
                        }
                    }   
                    if (music &&  music.player && music.queue.length && music.current) {
                        const noj = music.queue.map((t) => t.info.length);		  
                        uptocome = noj.reduce(function(a, b){
                            return a + b;
                        }, 0);
                        if(music &&  music.player && music.player.position) { remin = music.current.info.length - music.player.position; } else {remin = music.current.info.length;}
                        total = uptocome + remin;
                    } else if (music &&  music.player && !music.queue.length && music.current && music.player.position) {
                        total = music.current.info.length - music.player.position; 	
                    }
                    else if (music &&  music.player && !music.queue.length && music.current && !music.player.position) {
                        total = music.current.info.length; 	
                    }
                    
                    music.queue.push(track);
                }
                if (Number(total)) {time = `Time till play: ${util.millisToDuration(total)} Mins`;}
                if (music.player && music.player.track) {
                    interaction.editReply({
                        embeds: [util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${playlistName}**. ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN." : time}`)
                            .setAuthor(tracks[0].info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")					
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]
                    });} else {
                    interaction.editReply({
                        embeds: [util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${playlistName}**.`)	
                            .setAuthor(tracks[0].info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")				
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]
                    });}		
            } else {
                const track = tracks[0];
                track.requester = ctx.author;
                if (music.player && music.player.track && !music.queue[0]) {
                    const plymsg = await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});
                    if (plymsg) { 
                        if (plymsg.embeds)
                        {const nah = plymsg.embeds[0];                           
                            nah.addField("Next to Play", `[${track.info.title}](${track.info.uri})`, true); 
                            plymsg.edit({
                                embeds: [nah]
                            });}               
                    }
                }    
                if (music.player && music.queue.length && music.current) {
                    const noj = music.queue.map((t) => t.info.length);		  
                    uptocome = noj.reduce(function(a, b){
                        return a + b;
                    }, 0);
                    if(music.player.position) { remin = music.current.info.length - music.player.position; } else {remin = music.current.info.length;}
                   
                    total = uptocome + remin;
                } else if (!music.queue.length && music.current && music.player?.position) {
                    total = music.current.info.length - music.player.position; 	
                }
                else if (!music.queue.length && music.current && !music.player.position) {
                    total = music.current.info.length; 	
                }
                
                if (Number(total)) {time = `Time till play: ${util.millisToDuration(total)} Mins`;}
                music.queue.push(track);
                if (music.player?.track)
                    interaction.editReply({
                        embeds: [util.embed().setDescription(`✅ | **${track.info.title}** added to the queue. ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN." : time}`)	
                            .setAuthor(track.info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]
                    });
            }
            if (!music.player) await music.join(ctx.member.voice.channel);
            if (!music.player.track) {
                let plymsg;
                if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
                if (plymsg) plymsg.delete();
                let pussy;	
                messageez[ctx.guild.id] = {
                    ID: pussy
                };	
                fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                    if (err) ctx.client.logger.error(err.stack);
                });	
                ctx.client.logger.info(`${ctx.client.user.username}: Queue Started Of ${ctx.guild.name}`);	
                interaction.editReply({
                    embeds: [util.embed().setDescription(`✅ | Started Playing **${music.queue[0].info.title}** Right Now~. `)	
                        .setAuthor(music.queue[0].info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")
                        .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                        .setTimestamp()]
                });
                await music.start();}
            music.setTextCh(ctx.channel);
               
        } catch (e) {
            ctx.client.logger.error(e.stack);
        }
    }
};
