const util = require("../../util");
module.exports = {
    name: "kiss",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let  kiss  = await ctx.client.image.sfw.kiss();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Return the Kiss ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Lonely`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Kisses ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Kiss Someone`)	
            .setImage(kiss.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}}); 
                                           
    }
};
