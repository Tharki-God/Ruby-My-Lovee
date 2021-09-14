const util = require("../../util");
module.exports = {
    name: "hentai",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        if (!ctx.channel.nsfw) return ctx.channel.send({embeds:[util.embed()
            .setFooter(`${ctx.author.username} Why So Horny?`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Command Can be used Only in NSFW Channels")	
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
        let  hentai  = await ctx.client.image.nsfw.hentai();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `DAMN You are intrested in ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Horny`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Wants to do Lewd Stuff with ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Watch Hentai`)	
            .setImage(hentai.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                               
    }
};
