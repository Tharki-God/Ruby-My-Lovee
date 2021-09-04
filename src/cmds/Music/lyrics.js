const fetch = require("node-fetch");
const util = require("../../util");
const { MessageButton, MessageActionRow } = require("discord.js");
const getLyrics = async (query) => {
    const body = await (await fetch(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(query)}`)).json();
    if (body.error) throw Error(body.error);
    return body;
};
module.exports = {
    name: "lyrics",
    aliases: ["ly"],
    usage: "lyrics [Song Name]",
    level: "Music",
    examples: ["lyrics Pakke Yaar"],
    description: [`Gets The Lyrics of An Song.
  (Will Be Deleted After 10 Mins)
  (╯°□°）╯︵ ┻━┻`],
    exec: async (ctx) => {
        const {music, args} = ctx;
        let query;
        if (ctx.guild.purge) ctx.msg.delete();
        if (args.length) {
            query = args.join(" ");
        } else if (music.current) {
            const separatedArtistAndTitle = /(.+) - (.+)/.test(music.current.info.title);
            query = `${separatedArtistAndTitle ? music.current.info.title : music.current.info.author.replace(" - Topic", "")} - ${music.current.info.title}`;
        } else {
            return ctx.channel.send({embeds:[util.embed().setDescription("You Need to Provide Song Name.")
                .setAuthor("❌ | What are you Even Searching For?", ctx.client.user.displayAvatarURL(), "")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        }
        
        try {
            const res = await getLyrics(query);
            const splittedLyrics = util.chunk(res.lyrics, 1024);

            const embed = util.embed()			
                .setAuthor(`[**${res.author}**]`, ctx.client.user.displayAvatarURL())
                .setTitle(`[**${res.title}**]`)
                .setURL(res.links.genius)
                .setThumbnail(res.thumbnail.genius)
                .setDescription(splittedLyrics[0])
                .setFooter(`Page 1 of ${splittedLyrics.length}.`, ctx.author.displayAvatarURL({dynamic:true}))
                .setTimestamp();

            const lyricsMsg = await ctx.channel.send({
                embeds:[embed],
                components:
                splittedLyrics.length > 1
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
            if (splittedLyrics.length > 1) await util.pagination(lyricsMsg, ctx.author, splittedLyrics, "lyrics");
            ctx.channel.messages.fetch(lyricsMsg.id).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 60000);}});
        } catch (e) {
            if (e.message === "Sorry I couldn't find that song's lyrics") ctx.channel.send({embeds:[util.embed().setDescription(`❌ | ${e.message}`)]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            else ctx.client.logger.error(`An error occured: ${e.message}.`);   
        }
    }
};