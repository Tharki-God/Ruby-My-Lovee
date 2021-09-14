const util = require("../../util");
module.exports = {
    name: "slap",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
   

        let  slap  = await ctx.client.image.sfw.slap();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `You Have Been Slapped ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is a Psycho`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} Slaps ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Slap Someone`)	
            .setImage(slap.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
