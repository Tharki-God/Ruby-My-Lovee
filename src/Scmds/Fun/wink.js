const util = require("../../util");
module.exports = {
    name: "wink",
    level: "Fun",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    description: "Sends a GIF Of Winking",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
        let  wink  = await ctx.client.image.sfw.wink();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `You Have To React ${user.username}` : `${ctx.author.username} Winks at Someone`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} Winks Toward ${user.username}` : `${ctx.author.username} Is Winking Toward Someone`)	
            .setImage(wink.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
