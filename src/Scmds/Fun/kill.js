const util = require("../../util");
module.exports = {
    name: "kill",
    level: "Fun",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    description: "Sends a GIF Of Killing",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
   

        let  kill  = await ctx.client.image.sfw.hug();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `You are Dead ${user.username}` : `${ctx.author.username} Is a Psycho`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} Kills ${user.username}` : `${ctx.author.username} Wants to Kill Someone`)	
            .setImage(kill.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                           
    }
};
