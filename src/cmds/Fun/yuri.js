const util = require("../../util");
module.exports = {
    name: "yuri",
    level: "Fun",
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        if (!ctx.channel.nsfw) return ctx.channel.send({embeds:[util.embed()
            .setFooter(`${ctx.author.username} Why So Horny?`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Command Can be used Only in NSFW Channels")	
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
        let  yuri  = await ctx.client.image.nsfw.lesbian();
        ctx.channel.send({embeds:[util.embed()
            .setFooter(ctx.msg.mentions.users.first() ?  `Be Yuri ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Is So Horny`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(ctx.msg.mentions.users.first() ?  `${ctx.msg.author.username} is Yuri for ${ctx.msg.mentions.users.first().username}` : `${ctx.author.username} Wants to Be Yuri`)	
            .setImage(yuri.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                               
    }
};
