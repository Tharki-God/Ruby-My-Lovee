const util = require("../../util");
const { MessageButton, MessageActionRow } = require("discord.js");
const { porgressBar } = require("music-progress-bar");
module.exports = {
    name: "queue",
    type: "CHAT_INPUT",
    level:"Music",
    description: "Shows the Queue of Songs to Be Played by The Bot.  ",
    exec: async (ctx) => {
        const { interaction, music } = ctx;
        
        if (!music.player?.track) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Currently not playing anything.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        if (!music.queue.length && !music.previous.length) return interaction.editReply({ embeds: [util.embed().setDescription("❌ | Queue is empty.")		
            .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()] });
        const none = [];
        const prevs = none.concat(music.previous).reverse();
        prevs.push(music.current);
        const all = prevs.concat(music.queue);
        const queue = all.map((t, i) => `\`${++i}.\` **${t.info.title}** ${t.requester}`);
        const chunked = util.chunk(queue, 10).map(x => x.join("\n"));
        const ilive = music.queue.some(track => track.info.isStream);
        const embed = util.embed()
            .setAuthor(` |  ${ctx.guild.name} Music Queue`, ctx.guild.iconURL({ dynamic: true }))      
            .setThumbnail("https://cdn.discordapp.com/attachments/879114142458478603/879114169813708860/thumb-1920-1010992.png")
            .setImage("https://cdn.discordapp.com/attachments/879114142458478603/879114878013550612/e0b.gif")      
            .setDescription(`🔊 Now Playing: \n${music.current.info.isStream ? "[**Live**<a:source:845082952303771658>]" : ""}[${music.previous.length + 1}. ${music.current.info.title}](${music.current.info.uri}) [${music.current.info.isStream ? "Ask the Streamer how much left :)" : util.millisToDuration(music.current.info.length - music.player.position)} Left]\n${music.current.info.isStream ? "" : `${porgressBar({currentPositon:music.player.position ? music.player.position /1 : 0 ,endPositon:music.current.info.length,width:16,barStyle:"=",currentStyle:"🔘"}, {format:" [ <bar> ] <precent> <%>"})}`}\n🔊Queue:\n${chunked == "" ? " No other tracks here" : "" + chunked[0]}`)
            .setFooter(`Page 1/${chunked.length === 0 ? "1" : chunked.length} | Track's in Queue: ${queue.length === 0 ? "1" :queue.length} | ${ilive ? "The Queue Include Live Tracks So Length is Infinite RN": `Total Length: ${util.millisToDuration(music.queue.reduce((prev, curr) => prev + curr.info.length, 0) + (music.current.info.length - music.player.position))}`}`)
            .setTimestamp();		

        try {
            const queueMsg = await interaction.editReply({
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
        } catch (err) {
            ctx.client.logger.error(err.message);
        }
    }
};
