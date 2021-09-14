const util = require("../../util");
module.exports = {
    name: "wink",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
   

        let  wink  = await ctx.client.image.sfw.wink();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `You Have To React ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Winks at Someone`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Winks Toward ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is Winking Toward Someone`)	
            .setImage(wink.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
