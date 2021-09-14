const util = require("../../util");
module.exports = {
    name: "cuddle",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let  cuddle  = await ctx.client.image.sfw.cuddle();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Cuddle Them Back ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Lonely`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Cuddles ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Cuddle Someone`)	
            .setImage(cuddle.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}}); 
                                          
    }
};
