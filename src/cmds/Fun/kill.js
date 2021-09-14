const util = require("../../util");
module.exports = {
    name: "kill",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
   

        let  kill  = await ctx.client.image.sfw.hug();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `You are Dead ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is a Psycho`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Kills ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Kill Someone`)	
            .setImage(kill.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
