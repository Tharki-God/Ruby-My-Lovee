const { Permissions } = require("discord.js");
module.exports =  {
    name: "nick",
    aliases: ["nk", "name", "nickname"], 
    level: "Admin",
    usage: "nick [Name]",
    examples: ["nick Tai Ki Betti"],
    description: [`Used to Chnage Nickname of Bot
  [Can't be Used by Server Owner :D]`],		
    exec: async (ctx) => {
        const { args } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
       
        var nick = args.join(" ");
		
		
        if (!nick && !ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID) {
            ctx.guild.members.cache.get(ctx.client.user.id).setNickname("Lund");
            ctx.channel.send("Send Some Nudes To <@!604309370301448203>");
            ctx.channel.send("You Are My Love Daddy <@!811287677601185843>");
            return;
        }
	
        if (ctx.member.id === process.env.OWNER_ID) {
            ctx.guild.members.cache.get(ctx.client.user.id).setNickname(nick);	
            return;
        }
        ctx.channel.send("Send Some Nudes To <@!604309370301448203>");
        ctx.channel.send("You Are My Love <@!701424426394320967>");
        ctx.guild.members.cache.get(ctx.client.user.id).setNickname(nick);
	
	
    }};
