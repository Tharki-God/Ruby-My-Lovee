const util = require("../../util");
module.exports = {
    name: "hentai",
    level: "Fun",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    description: "Sends a Hentai GIF",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
        if (!ctx.channel.nsfw) return interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} Why So Horny?`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Command Can be used Only in NSFW Channels")	
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}}); 
        let  hentai  = await ctx.client.image.nsfw.hentai();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `DAMN You are intrested in ${user.username}` : `${ctx.author.username} Is So Horny`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} Wants to do Lewd Stuff with ${user.username}` : `${ctx.author.username} Wants to Watch Hentai`)	
            .setImage(hentai.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                               
    }
};
