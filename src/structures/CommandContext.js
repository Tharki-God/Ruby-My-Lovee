const MusicHandler = require("./MusicHandler");

module.exports = class CommandContext {
    constructor(cmd, msg, args) {
        this.cmd = cmd;
        this.msg = msg;
        this.args = args;
    }

    get client() {
        return this.msg.client;
    }

    get guild() {
        return this.msg.guild;
    }

    get channel() {
        return this.msg.channel;
    }

    get member() {
        return this.msg.member;
    }

    get author() {
        return this.msg.author;
    }

    get music() {
        if (this.client.musics.has(this.guild.id)) {
            return this.client.musics.get(this.guild.id);
        }
        const musicHandler = new MusicHandler(this.guild);
        this.client.musics.set(this.guild.id, musicHandler);
        return musicHandler;
    }

    respond(opt) {
        return this.msg.reply(opt);
    }
};