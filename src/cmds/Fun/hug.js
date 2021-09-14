const util = require("../../util");
module.exports = {
    name: "hug",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let hug  = await ctx.client.image.sfw.hug();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Return the Hug ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Lonely`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Hugs ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Hug Someone`)	
            .setImage(hug.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}}); 
                                            
    }
};
