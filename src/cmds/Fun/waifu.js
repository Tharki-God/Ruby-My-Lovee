const util = require("../../util");
module.exports = {
    name: "waifu",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
   

        let  waifu  = await ctx.client.image.sfw.waifu();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Are you Their Waifu ${ctx.msg.mentions.users.first().username}?` : `${ctx.author.username} Is So Lonely`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Makes ${ctx.msg.mentions.users.first().username} Their Waifu` : `${ctx.author.username} wants a Waifu`)	
            .setImage(waifu.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
