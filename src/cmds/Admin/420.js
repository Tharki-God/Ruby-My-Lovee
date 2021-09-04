

const util = require("../../util");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const fs = require("fs");
const { Permissions } = require("discord.js");
const modes = [true ,false];
module.exports = {
    name: "24/7",
    aliases: ["everytime", "forever", "stay", "Gae?"],
    level: "Admin",
    usage: "24/7 [on/off]",
    examples: ["24/7 on"],
    description: ["Stays in Voice Channel When Enabled."],
    exec: async (ctx) => {
        let status = JSON.parse(fs.readFileSync("./database/420.json", "utf8"));	
        if(!status[ctx.guild.id]){
            status[ctx.guild.id] = {
                info: false
            };
        }
        let toogle  = status[ctx.guild.id].info;
        if (!ctx.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) && !ctx.member.permissions.has([Permissions.FLAGS.ADMINISTRATOR]) && ctx.author.id !== process.env.OWNER_ID)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | BRUH you Don't Even Have Perms To Use this Command.")			
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            });
    

        const selectMsg = await ctx.channel.send({
            embeds: [
                util.embed()
                    .setDescription(`✅ | Current 24/7 Status: ${toogle ? "On": "Off"}`)
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
                                    description: "Turns on 24/7 for the server.",
                                    value: "0",
                                    emoji: "🆗"
                                },
                                {
                                    label: "Off",
                                    description: "Turns of 24/7 for the server.",
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
        status[ctx.guild.id] = {
            info: modes[selected.values[0]]
        };	
        fs.writeFile("./database/420.json", JSON.stringify(status, null, 2), (err) => {
            if (err) console.log(err);
        });  
        console.log(modes[selected.values[0]]);
        selected.editReply({ embeds: [util.embed().setDescription(`✅ | Set 24/7 Status to: ${modes[selected.values[0]] ? "On": "Off"}`)], components: [] });
    }
};