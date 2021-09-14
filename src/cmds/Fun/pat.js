const util = require("../../util");
module.exports = {
    name: "pat",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
       
        let  pat  = await ctx.client.image.sfw.pat();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Return the Pat ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Generous`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Pats ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Pat Someone`)	
            .setImage(pat.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                            
    }
};
