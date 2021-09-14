const util = require("../../util");
module.exports = {
    name: "yuri",
    level: "Fun",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    description: "Sends a Yuri GIF",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
        if (!ctx.channel.nsfw) return interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} Why So Horny?`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Command Can be used Only in NSFW Channels")	
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
        let  yuri  = await ctx.client.image.nsfw.lesbian();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `Be Yuri ${user.username}` : `${ctx.author.username} Is So Horny`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} is Yuri for ${user.username}` : `${ctx.author.username} Wants to Be Yuri`)	
            .setImage(yuri.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                               
    }
};
