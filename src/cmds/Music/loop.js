const util = require("../../util");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const modes = ["None", "Single Track", "Queue"];
const fs = require("fs");
let pussy;
module.exports = {
    name: "loop",
    aliases: ["repeat"],
    usage: "loop [Mode]",
    level: "Music",
    examples: ["Loop", "loop single"],
    description: ["Loops the Queue/Song to Play it Endlessly(❁´◡`❁)"],
    exec: async (ctx) => {
        const { music } = ctx;
        if (ctx.guild.purge) ctx.msg.delete();
        let messageez = JSON.parse(fs.readFileSync("./database/messageez.json", "utf8"));				
        if(!messageez[ctx.guild.id]){
            messageez[ctx.guild.id] = {
                ID: pussy
            };
        }
        let last  = messageez[ctx.guild.id].ID;
        if (!music.player) return ctx.channel.send({
            embeds: [util.embed().setDescription("❌ | Currently not playing anything.")                                  
                .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()]
        }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        if (!ctx.member.voice.channel)
            return ctx.channel.send({
                embeds: [util.embed().setDescription("❌ | You must be on a voice channel.")                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        if (ctx.guild.me.voice.channel && !ctx.guild.me.voice.channel.equals(ctx.member.voice.channel))
            return ctx.channel.send({
                embeds: [util.embed().setDescription(`❌ | You must be on ${ctx.guild.me.voice.channel} to use this command.`)                                  
                    .setFooter(ctx.author.username,  ctx.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()]
            }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});

        const selectMsg = await ctx.channel.send({
            embeds: [
                util.embed()
                    .setDescription(`✅ | Current loop mode: ${modes[music.loop]}`)
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
                                    label: "None",
                                    description: "Disable loop",
                                    value: "0",
                                    emoji: "⛔"
                                },
                                {
                                    label: "Track",
                                    description: "Repeat one track only",
                                    value: "1",
                                    emoji: "🔂"
                                },
                                {
                                    label: "Queue",
                                    description: "Repeat all tracks in the queue",
                                    value: "2",
                                    emoji: "🔃"
                                }
                            ])
                    )
            ]
        });

        const selected = await util.awaitSelection(selectMsg, interaction => interaction.user.equals(ctx.author));
        if (!selected) return selectMsg.edit({ embeds: [selectMsg.embeds[0].setFooter("")], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 5000);}});
        await selected.deferUpdate();
        music.loop = parseInt(selected.values[0]);
        selected.editReply({ embeds: [util.embed().setDescription(`✅ | Set loop mode to: ${modes[music.loop]}`)], components: [] }).then(msg => {if (msg.guild.purge) {setTimeout(() => msg.delete(), 10000);}});
        let plymsg;
        if (Number(last)) {plymsg =  await ctx.channel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}
        if (plymsg) {               
            const nah = plymsg.embeds[0];
            nah.fields[4] = { name: "Looping", value: modes[music.loop], inline: true };
            await plymsg.edit({
                embeds :[nah]
            });            
        }
    }
};