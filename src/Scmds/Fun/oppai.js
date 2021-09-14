const util = require("../../util");
module.exports = {
    name: "oppai",
    options: 
       [{
           name: "user",
           description: "The user You want this reaction for.",
           type:"USER",
           required:false,
       }],
    level: "Fun",
    description: "Sends a GIF Of Oppai",
    exec: async (ctx) => {
        const {interaction, args} = ctx;
        const [userId] = args;
        const {user} = userId ? ctx.guild.members.cache.get(userId) : "{user:false}" ;
        if (!ctx.channel.nsfw) return interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} Why So Horny?`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("Command Can be used Only in NSFW Channels")	
            .setTimestamp()] }); 
        let  boobs  = await ctx.client.image.nsfw.boobs();
        interaction.editReply({embeds:[util.embed()
            .setFooter(`${ctx.author.username} At your Own Risk.\n We Don't Care. No One Do.`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription("The Media my include sensitive content.")	
            .setTimestamp()]}); 
        ctx.send({embeds:[util.embed()
            .setFooter(userId ?  `Show them Oppai ${user.username}` : `${ctx.author.username} Is So Horny`,  ctx.author.displayAvatarURL({ dynamic: true }))
            .setDescription(userId ?  `${ctx.author.username} Wants ${user.username}'s Oppai` : `${ctx.author.username} Wants to see Someone's Oppai`)	
            .setImage(boobs.image)
            .setTimestamp()] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 30000);}});                                               
    }
};
