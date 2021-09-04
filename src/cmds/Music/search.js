const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const util = require("../../util");
const fs = require("fs");
const emojiNumbers = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

module.exports = {
    name: "search",
    aliases: ["sr", "nikal"],
    usage: "search [Song Name]",
    examples: ["search Pakke Yaar"],
    level: "Music",
    description: "Search song to play and then add it to queue.",
    exec: async (ctx) => {
        const { music, args } = ctx;
        let pussy;
        let total;
        let remin;
        let uptocome;
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        if (!ctx.member.voice.channel)
            return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.channel.send({ embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        const missingPerms = util.missingPerms(ctx.guild.me.permissionsIn(ctx.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return ctx.channel.send({ embeds: [util.embed().setDescription(`❌ | I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`)
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        if (music.node?.state !== 1)
            return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Lavalink node is not connected yet.")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        const query = args.join(" ");
        if (!query) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | You Need to Provide Something to Search BRUH.")
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return ctx.channel.send({ embeds: [util.embed().setDescription(" Couldn't find any results.")
                .setAuthor("❌ | You Serious", ctx.client.user.displayAvatarURL())
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

            tracks = tracks.slice(0, 10);

            const resultMessage = await ctx.channel.send({
                embeds: [util.embed()
                    .setAuthor("Song Selection", ctx.client.user.displayAvatarURL())
                    .setDescription("Pick one of the search results that you would like to add to the queue")
                    .setFooter("You can select \"cancel\" to cancel the command.")
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId("selected")
                                .setPlaceholder("Nothing selected")
                                .addOptions([
                                    ...tracks
                                        .map((x, i) => (
                                            {
                                                label: x.info.title,
                                                description: x.info.author,
                                                value: i.toString(),
                                                emoji: emojiNumbers[i]
                                            }
                                        )),
                                    ...[
                                        {
                                            label: "Cancel",
                                            description: "Cancel selection",
                                            value: "10",
                                            emoji: "❌"
                                        }
                                    ]
                                ])
                        )
                ]
            });

            const selected = await util.awaitSelection(resultMessage, interaction => interaction.user.equals(ctx.author));
            if (!selected) return resultMessage.edit({ embeds: [util.embed().setDescription("❌ | Time is up!")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            await selected.deferUpdate();

            if (selected.values[0] === "10")
                return selected.editReply({ embeds: [util.embed().setDescription("✅ | Cancelled.")
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

            const track = tracks[selected.values[0]];
            track.requester = ctx.author;
            const ilive = music.queue.some(track => track.info.isStream);  
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
            } else if (!music.queue.length && music.current && music.player.position) {
                total = music.current.info.length - music.player.position; 	
            }
            else if (!music.queue.length && music.current && !music.player.position) {
                total = music.current.info.length; 	
            }
            music.queue.push(track);
            let time;
            if (Number(total)) {time = `Time till play: ${util.millisToDuration(total)} Mins`;}
            if (music.player?.track) {
                selected.editReply({ embeds: [util.embed().setDescription(`✅ | **${track.info.title}** added to the queue. ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN." : time}`)
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            } else {
                selected.deleteReply();
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
                await music.start();}
            music.setTextCh(ctx.channel);
        } catch (e) {
            ctx.client.logger.error(`An error occured: ${e.message}.`);
        }
    }
};
