const util = require("../../util");
module.exports = {
    name: "kiss",
    level: "Fun",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    description: "Sends a GIF Of Kiss",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
        let  kiss  = await ctx.client.image.sfw.kiss();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `Return the Kiss ${user.username}` : `${ctx.author.username} Is So Lonely`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} Kisses ${user.username}` : `${ctx.author.username} Wants to Kiss Someone`)	
            .setImage(kiss.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}}); 
                                           
    }
};
