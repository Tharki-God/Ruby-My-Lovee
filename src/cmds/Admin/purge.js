
const util = require("../../util");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require("fs");
const { Permissions } = require("discord.js");
const modes = [true ,false];
module.exports = {
    name: "purge",
    aliases: ["delete", "clean", "wipe", "chut"],
    level: "Admin",
    usage: "purge [on/off]",
    examples: ["purge on"],
    description: ["Toogle if the bot will delete messages or not."],
    exec: async (ctx) => {
        if (ctx.guild.purge) ctx.msg.delete();
        let purge = JSON.parse(fs.readFileSync("./database/purge.json", "utf8"));	
        if(!purge[ctx.guild.id]){
            purge[ctx.guild.id] = {
                status: true
            };
        }
        let toogle  = purge[ctx.guild.id].status;
        ctx.guild.purge = toogle;
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    
       

        const selectMsg = await ctx.channel.send({
            embeds: [
                util.embed()
                    .setDescription(`✅ | Current Purge Status: ${ctx.guild.purge ? "On": "Off"}`)
                    .setFooter("Just click on the select menu if you wish to change it" , ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("selected")
                            .setPlaceholder("Nothing selected")
                            .addOptions([
                                {
                                    label: "On",
                                    description: "Enables Automatic Purge for The bot messages and bot commands.",
                                    value: "0",
                                    emoji: "🆗"
                                },
                                {
                                    label: "Off",
                                    description: "Disables Automatic Purge for The bot messages and bot commands.",
                                    value: "1",
                                    emoji: "🈶"
                                }
                            ])
                    )
            ]
        });

        const selected = await util.awaitSelection(selectMsg, interaction => interaction.user.equals(ctx.author));
        if (!selected) return selectMsg.edit({ embeds: [selectMsg.embeds[0].setFooter("")], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
        await selected.deferUpdate();
        ctx.guild.purge = modes[selected.values[0]];
        purge[ctx.guild.id] = {
            status: modes[selected.values[0]]
        };	
        fs.writeFile("./database/purge.json", JSON.stringify(purge, null, 2), (err) => {
            if (err) console.log(err);
        });    
        selected.editReply({ embeds: [util.embed().setDescription(`✅ | Set Purge Status to: ${modes[selected.values[0]] ? "On": "Off"}`)], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
    }
};