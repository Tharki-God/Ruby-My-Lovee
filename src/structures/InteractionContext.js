const MusicHandler = require("./MusicHandler");
const fs = require("fs");
let channels = JSON.parse(fs.readFileSync("./database/channels.json", "utf8"));
        
        
module.exports = class InteractionContext {
    constructor(client, interaction, args) {
        this.client = client;
        this.interaction = interaction;
        this.args = args;
    }


    get guild() {
        return this.interaction.guild;
    }

    get channel() {
        if (channels[this.interaction.guild.id] && channels[this.interaction.guild.id].channel && this.interaction.guild.channels.cache.get(channels[this.interaction.guild.id].channel) !== undefined && this.interaction.channel.id !== channels[this.interaction.guild.id].channel) 
        {return this.interaction.guild.channels.cache.get(channels[this.interaction.guild.id].channel);}
        else
        {return this.interaction.channel;}
    }

    get member() {
        return this.interaction.guild.members.cache.get(this.interaction.user.id);  
    }

    get author() {
        return this.interaction.user;
    }

    get music() {
        if (this.client.musics.has(this.guild.id)) {
            return this.client.musics.get(this.guild.id);
        }
        const musicHandler = new MusicHandler(this.guild);
        this.client.musics.set(this.guild.id, musicHandler);
        return musicHandler;
    }

    send(opt) {
        if (!this.channel.permissionsFor(this.guild.me).has("SEND_MESSAGES") || !this.channel.permissionsFor(this.guild.me).has("EMBED_LINKS")) return this.interaction.editReply({ content: "I Don't Have Message Sending Perms in the channel.", allowedMentions: { repliedUser: false } });
        return this.channel.send(opt);
    }

};