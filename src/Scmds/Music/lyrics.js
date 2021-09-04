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
    type: "CHAT_INPUT",
    level: "Music",
    options: [{
        name: "song",
        description: "Song name you want to get lyrics of.",
        type:"STRING",
        required:false,
    }],
    description: "Gets The Lyrics of An Song.",
    exec: async (ctx) => {
        const {interaction, music, args} = ctx;
        let query;
        if (args.length) {
            [query] = args;
        } else if (music.current) {
            const separatedArtistAndTitle = /(.+) - (.+)/.test(music.current.info.title);
            query = `${separatedArtistAndTitle ? music.current.info.title : music.current.info.author.replace(" - Topic", "")} - ${music.current.info.title}`;
        } else {
            return interaction.editReply({embeds:[util.embed().setDescription("You Need to Provide Song Name.")
                .setAuthor("❌ | What are you Even Searching For?", ctx.client.user.displayAvatarURL(), "")
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]});
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

            const lyricsMsg = await interaction.editReply({
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
        } catch (e) {
            if (e.message === "Sorry I couldn't find that song's lyrics") interaction.editReply({embeds:[util.embed().setDescription(`❌ | ${e.message}`)]});
            else ctx.client.logger.error(`An error occured: ${e.message}.`);   
        }
    }
};