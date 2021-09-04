const { readFileSync } = require("fs");
const fs = require("fs");
const util = require("../util");
module.exports = {
    name: "voiceStateUpdate",
    exec: async (client, oldState, newState) => {   
        const music = client.musics.get(newState.guild.id);
        if (newState.member.user.equals(client.user) && !newState.channel && music && music.player) {
            if (music.player.track) await music.stop();
            if (music.player) await music.node.leaveChannel(music.guild.id);
            return;
        }
        if (newState.member.user.equals(client.user) && !newState.channel) return;
        if (oldState.guild.me.voice.channelID === oldState.channelID && oldState.channel && oldState.channel.members.size === 1 && music && music.player && music.player?.track && !music.player?.paused && music.current && !music.current.info.isStream) {await music.pause();} 
        else if (newState && newState.guild.me.voice.channelID === newState.channelID && newState.channel && newState.channel.members.size >= 2 && music && music.player && music.player?.track && music.player?.paused && music.current && !music.current.info.isStream) {await music.resume();}
        if (oldState.channelID !== oldState.guild.me.voice.channelID || newState.channel)
            return;
        let messageez = JSON.parse(readFileSync("./database/messageez.json", "utf8"));
        let pussy;
        if(!messageez[newState.guild.id]){
            messageez[newState.guild.id] = {
                ID: pussy
            };
        }
        let last = messageez[newState.guild.id].ID;
        let plymsg;
        if (Number(last) && music && music.textChannel) {plymsg =  await music.textChannel.messages.fetch(last).catch(err => {if (err.code == 10008) {return false;}});} else {plymsg = false;}	
        let status = JSON.parse(readFileSync("./database/420.json", "utf8"));
		
        if(!status[newState.guild.id]){
            status[newState.guild.id] = {
                info: false
            };
        }
        let toogle = status[newState.guild.id].info;
        if (!toogle) {
            if (oldState.channel && oldState.channel.members.size === 1 && music && music.player && !music.player?.track ) {
                setTimeout(() => { 
                    if (oldState.channel && oldState.channel.members.size === 1 && music && music.player && !music.player?.track )  
                        music.node.leaveChannel(music.guild.id); 
                    if (plymsg){
                        plymsg.edit({ embeds: [util.embed().setDescription("I wasn't Playing Anything And No One Was there So I left, Let me Stay Forever by Using 24/7 Command.")
                            .setAuthor("🈵 | I am no More" , client.user.displayAvatarURL())
                            .setFooter(newState.guild.name, newState.guild.iconURL({ dynamic: true }))
                            .setTimestamp()]}),
                        plymsg.reactions.removeAll(),
                        messageez[newState.guild.id] = {
                            ID: ""
                        };	
                        if (plymsg.guild.purge) setTimeout(() => plymsg.delete(), 10000);	
                        fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                            if (err) client.logger.error(err.stack);
                        });
                    }
                    music.reset();
                }, 600000);
            } else if (oldState.channel && oldState.channel.members.size === 1 && music && music.player  && music.player?.track ) {
                setTimeout(() => { 
                    if (oldState.channel && oldState.channel.members.size === 1 && music && music.player  &&  music.player?.track) 	 
                        music.node.leaveChannel(music.guild.id);
                    if (plymsg){
                        plymsg.edit({ embeds: [util.embed().setDescription("No One Was In VC So I left, Let me Stay Forever by Using 24/7 Command.")
                            .setAuthor("🈵 | I am no More" , client.user.displayAvatarURL())
                            .setFooter(newState.guild.name, newState.guild.iconURL({ dynamic: true }))
                            .setTimestamp()]}),
                        plymsg.reactions.removeAll(),
                        messageez[newState.guild.id] = {
                            ID: ""
                        };
                        if (plymsg.guild.purge) setTimeout(() => plymsg.delete(), 10000);	
                        fs.writeFile("./database/messageez.json", JSON.stringify(messageez, null, 2), (err) => {
                            if (err) client.logger.error(err.stack);
                        });
                    }
                    music.reset();
                }, 1800000); 
            } 
        }
    }
};
