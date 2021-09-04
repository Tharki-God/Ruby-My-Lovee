const util = require("../../util");
const { MessageButton, MessageActionRow } = require("discord.js");
const { porgressBar } = require("music-progress-bar");
module.exports = {
    name: "queue",
    aliases: ["q"],
    level: "Music",
    usage: "queue",
    description: ["Shows the Queue of Songs to Be Played by The Bot. ╰(*°▽°*)╯ "],
    exec: async (ctx) => {
        const { music } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        if (!music.player?.track) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (!music.queue.length) return ctx.channel.send({ embeds: [util.embed().setDescription("❌ | Queue is empty.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

      
        const queue = music.queue.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);      
        const chunked = util.chunk(queue, 10).map(x => x.join("\n"));
        const ilive = music.queue.some(track => track.info.isStream);
        const embed = util.embed()
            .setAuthor(` |  ${ctx.guild.name} Music Queue`, ctx.guild.iconURL({ dynamic: true }))      
            .setThumbnail("https://cdn.discordapp.com/attachments/879114142458478603/879114169813708860/thumb-1920-1010992.png")
            .setImage("https://cdn.discordapp.com/attachments/879114142458478603/879114878013550612/e0b.gif")      
            .setDescription(`🔊 Now Playing: \n${music.current.info.isStream ? "[**Live**<a:source:845082952303771658>]" : ""}[${music.current.info.title}](${music.current.info.uri}) [${music.current.info.isStream ? "Ask the Streamer how much left :)" : util.millisToDuration(music.current.info.length - music.player.position)} Left]\n${music.current.info.isStream ? "" : `${porgressBar({currentPositon:music.player.position /1,endPositon:music.current.info.length,width:16,barStyle:"=",currentStyle:"🔘"}, {format:" [ <bar> ] <precent> <%>"})}`}\n🔊Up Next:\n${chunked == "" ? " No other tracks here" : "" + chunked[0]}`)
            .setFooter(`Page 1/${chunked.length === 0 ? "1" : chunked.length} | Track's in Queue: ${queue.length === 0 ? "1" :queue.length} | ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN": `Total Length: ${util.millisToDuration(music.queue.reduce((prev, curr) => prev + curr.info.length, 0) + (music.current.info.length - music.player.position))}`}`)
            .setTimestamp();		

        try {
            const queueMsg = await ctx.channel.send({
                embeds: [embed],
                components:
                        chunked.length > 1
                            ? [
                                new MessageActionRow()
                                    .addComponents(
                                        ...util.paginationEmojis.map((x, i) =>
                                            new MessageButton()
                                                .setCustomId(x)
                                                .setEmoji(x)
                                                .setStyle(i === 2 ? "DANGER" : "SUCCESS")
                                        )
                                    )
                            ]
                            : []
            });
            if (chunked.length > 1) util.pagination(queueMsg, ctx.author, chunked, "queue");
            ctx.channel.messages.fetch(queueMsg.id).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 60000);}});
        } catch (err) {
            ctx.client.logger.error(err.message);
        }
    }
};
