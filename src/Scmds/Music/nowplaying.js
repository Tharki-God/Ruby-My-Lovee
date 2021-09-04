const util = require("../../util");
const { porgressBar } = require("music-progress-bar");
const loop = ["None", "Track", "Queue"];

module.exports = {
    name: "nowplaying",
    type: "CHAT_INPUT",
    level: "Music",
    description: "Shows Info about the Song Currently Being Played",
    exec: async (ctx) => {
        let wide;
        const { music, interaction } = ctx;
        if (!music.player?.track) {		
            interaction.editReply({ embeds:[util.embed().setDescription("❌ | Currently not playing anything.")		
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]}).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
            return; }
      
        let nowPlaying = util.embed()
            .setTitle(`**${music.current.info.title}**.`)
            .setURL(`${music.current.info.uri}`)
            .setAuthor("🎶 | Now playing ", ctx.client.user.displayAvatarURL())
            .addField("Requested by:", `<@!${music.current.requester.id}>`)		
            .setTimestamp();	
		
        if (util.isYoutube(music.current.info.uri)) {
            wide = "32";
            nowPlaying.setImage(`https://img.youtube.com/vi/${music.current.info.identifier}/0.jpg`);} 
        else if 
        (!util.isYoutube(music.current.info.uri) && !util.isSpotify(music.current.info.uri)) {
            wide = "21";
            nowPlaying.setImage(`https://media.discordapp.net${music.current.info.uri.split("https://cdn.discordapp.com")[1]}?format=jpeg`);
        }
        else if (util.isSpotify(music.current.info.uri))
        { wide = "21";
            var { getData } = require("spotify-url-info");
            const spotify =  await getData(music.current.info.uri);
            nowPlaying.setImage(spotify.album.images[0].url);}
            

        if (music.player.paused) {nowPlaying.setAuthor("🎶 | Now paused ", ctx.client.user.displayAvatarURL());}
        if (music.current.info.isStream ) {
            nowPlaying.addField("\u200b", ":satellite:**The Video Is Live ◉**")
                .setFooter(ctx.author.username, ctx.author.displayAvatarURL({ dynamic: true }));
            if (music.player.paused) {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/775376498769002498/799875645177593907/giphy.gif?format=png");} else {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/775376498769002498/799875645177593907/giphy.gif");}
        }
        else if 
        (music.player.position > 0) {
            nowPlaying.addField(porgressBar({currentPositon:music.player.position /1,endPositon:music.current.info.length,width:wide,barStyle:"=",currentStyle:"🔘"}, {format:" <bar> ] \n\u3000<precent> <%> Completed"}),`\n\u3000[**Played: ${util.millisToDuration(music.player.position)} / ${util.millisToDuration(music.current.info.length)}**]` )
                .setFooter(`Time Remaining: ${util.millisToDuration(music.current.info.length - music.player.position /1)} Mins | ${music.queue[0]? `Next Song: ${music.queue[0].info.title} Requested By: ${music.queue[0].requester.username} |` : ""} Looping: ${loop[music.loop]}`, ctx.author.displayAvatarURL({ dynamic: true }));
            if (music.player.paused) {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/766131883423432736/799884276673806336/99xqXTF.gif?format=png");} else {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/766131883423432736/799884276673806336/99xqXTF.gif");}
        }
        else {
            nowPlaying.setFooter(ctx.author.username, ctx.author.displayAvatarURL({ dynamic: true }))
                .addField("\u200b", `${util.millisToDuration(music.player.position)} / ${util.millisToDuration(music.current.info.length)}`);
            if (music.player.paused) {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/766131883423432736/799882738349899796/ddfa71g-405a233e-04b5-4e1d-96c7-88c2a0b08338.gif?format=png");} else {nowPlaying.setThumbnail("https://media.discordapp.net/attachments/766131883423432736/799882738349899796/ddfa71g-405a233e-04b5-4e1d-96c7-88c2a0b08338.gif");}
        }
        return interaction.editReply({
            embeds:[nowPlaying]
        });
    }};


  