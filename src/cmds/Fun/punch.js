const util = require("../../util");
module.exports = {
    name: "punch",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
   

        let  punch  = await ctx.client.image.sfw.punch();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `You Have Been Punched ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is a Psycho`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Punches ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Punch Someone`)	
            .setImage(punch.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
