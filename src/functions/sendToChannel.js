const wsm = require('./ws/manager');
const { EventEmitter } = require('events');
const { getUser, sendToChannel } = require('./functions/a');

module.exports = class Client extends EventEmitter {
    constructor(token, opts) {
        super();

        if (!opts) {
            opts = {};
            opts.debug = false;
        }

        this.ws = new wsm(token, opts.debug);
        this.id = null;
        this._id = null;
        this.username = null;
        this.bot = true;

        this.ws.on('ready', (msg) => {
            const bot = msg.users[0];
            this.id = bot._id;
            this._id = this.id;
            this.username = bot.username;

            this.emit('ready');
        })
        this.ws.on('message', async (msg) => {
            const author = await getUser(msg.author, token).catch((e) => { console.log(e) });

            this.emit('message', {
                id: msg._id, content: msg.content, channel: {
                    id: msg.channel,
                    send: async (content) => {
                        this.sendToChannel(msg.channel, content);
                    }
                }, author,
                reply: async (content, ping = false) => {
                    return new Promise(async (resolve, reject) => {
                        const cnt = {
                            content: content.content,
                            attachments: content.attachments,
                            embeds: content.embeds,
                            masq: content.masq,
                            replies: [{ "id": msg._id, mention: ping }]
                        }
                        const m = await this.sendToChannel(msg.channel, cnt).catch((e) => { reject(e) });
                        resolve(m);
                    })
                }
            });
        })

        this.sendToChannel = async (channel, obj) => {
            return new Promise(async (resolve, reject) => {
                const x = await sendToChannel(channel, obj, token).catch((e) => reject(e));
                resolve(x);
            })
        }
    }
}
