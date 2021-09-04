const util = require("../../util");
const fs = require("fs");
const getAttachmentURL = ctx => ctx.attachments.first()?.url;
module.exports = {
    name: "play",
    aliases: ["p", "add"],
    usage: "play Song[Link/Name]",
    examples: ["play Pakke Yaar"],
    level: "Music",
    description: [`Used To Plays audio from YouTube or Spotify without any limit for Playing Time With the Meraki Bot
  Also To add Songs To Queue. :D 
  Almost Forgot to Mention it! :/
  ༼ つ ◕_◕ ༽つ`],
    exec: async (ctx) => {
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
        const { args, music } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!ctx.member.voice.channel)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        if (music.node?.state !== 1)
            return ctx.channel.send({
                embeds: [util.embed()
                    .setAuthor("❌ | Try Again Later.",ctx.client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription("Lavalink node is not connected yet.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        const query = args.join(" ") || getAttachmentURL(ctx.msg);
        if (!query) return ctx.channel.send({
            embeds: [util.embed().setDescription("BRUH you Need to Provide Song.")
                .setAuthor("❌ | What are you Even Trying MC.",ctx.client.user.displayAvatarURL({ dynamic: true }))			
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        try {
            const result =  await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!result || !result.tracks.length) return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | Couldn't find any results.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            const { type, playlistName, tracks } = result;
            const ilive = music.current ? music.current.info.isStream ? true : music.queue.some(track => track.info.isStream) : false;           
            if (type === "PLAYLIST_LOADED" || type === "PLAYLIST") {
                for (const track of tracks) {
                    track.requester = ctx.author;
                    if (getAttachmentURL(ctx.msg)){
                        const track = tracks[0];
                        track.info.author = "Not Known By Mankind(Yet)";
                        track.info.title = track.info.uri.split("/")[6];}
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
                if (music &&  music.player && music.player.track) {
                    ctx.channel.send({
                        embeds: [util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${playlistName}**. ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN." : time}`)
                            .setAuthor(tracks[0].info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")					
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]
                    }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});} else {
                    ctx.channel.send({
                        embeds: [util.embed().setDescription(`✅ | Loaded \`${tracks.length}\` tracks from **${playlistName}**.`)	
                            .setAuthor(tracks[0].info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")				
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()], ephemeral: true
                    }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});}		
            } else {
                const track = tracks[0];
                track.requester = ctx.author;
                if (getAttachmentURL(ctx.msg)){
                    const track = tracks[0];
                    track.info.author = "Not Known By Mankind(Yet)";
                    track.info.title = track.info.uri.split("/")[6];}
                if (music && music.player && music.player.track && !music.queue[0]) {
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
                    if(music.player.position) { remin = music.current.info.length - music.player.position; } else {remin = music.current.info.length;}
                   
                    total = uptocome + remin;
                } else if (music &&  music.player && !music.queue.length && music.current && music.player?.position) {
                    total = music.current.info.length - music.player.position; 	
                }
                else if (music &&  music.player && !music.queue.length && music.current && !music.player.position) {
                    total = music.current.info.length; 	
                }
                
                if (Number(total)) {time = `Time till play: ${util.millisToDuration(total)} Mins`;}
                music.queue.push(track);
                if (music.player?.track)
                    ctx.channel.send({
                        embeds: [util.embed().setDescription(`✅ | **${track.info.title}** added to the queue. ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN." : time}`)	
                            .setAuthor(track.info.author,owner.user.displayAvatarURL({ dynamic: true }),"https://en.wikipedia.org/wiki/Linus_Sebastian")
                            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                            .setTimestamp()]
                    }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
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
                await music.start();}
            music.setTextCh(ctx.channel);
               
        } catch (e) {
            ctx.client.logger.error(e.stack);
        }
    }
       
      
};
