const { Permissions } = require("discord.js");
module.exports =  {
    name: "nick",
    level: "Admin",
    type: "CHAT_INPUT",
    options:[{
        name: "nickname",
        description: "The nickname you want the bot with :).",
        type:"STRING",
        required:true,
    }],
    description: "Used to Chnage Nickname of Bot [Can't be Used by Server Owner :D]",		
    exec: async (ctx) => {
        const { interaction,args } = ctx;
       
        var [nick] = args;
		
		
        if (!nick && !ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID) {
            ctx.guild.members.cache.get(ctx.client.user.id).setNickname("Lund");
            interaction.editReply("Send Some Nudes To <@!604309370301448203>");
            interaction.followUp("You Are My Love Daddy <@!811287677601185843>");
            return;
        }
	
        if (ctx.member.id === process.env.OWNER_ID) {
            interaction.editReply(`Nickname set to ${nick}`);
            ctx.guild.members.cache.get(ctx.client.user.id).setNickname(nick);	
            return;
        }
        interaction.editReply("Send Some Nudes To <@!604309370301448203>");
        interaction.followUp("You Are My Love <@!701424426394320967>");
        ctx.guild.members.cache.get(ctx.client.user.id).setNickname(nick);
	
	
    }};
