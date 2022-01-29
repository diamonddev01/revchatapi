const webs = require('ws');
const { EventEmitter } = require('events');

module.exports = class manager extends EventEmitter {
    constructor(token, debug) {
        super();
        const ws = new webs('wss://ws.revolt.chat');
        this.auth = false;

        this.debug = debug || false;

        setTimeout((token) => {
            ws.send(JSON.stringify({
                "type": "Authenticate",
                "token": token
            }))
        }, 500, token);

        setInterval(() => {
            ws.send(JSON.stringify({
                "type": "Ping",
                "data": 0
            }))
        }, 60000);

        this.beginTyping = function (channel) {
            if (!ws || ws.readyState !== webs.OPEN) {
                return setTimeout(this.beginTyping, 500, channel);
            }

            const payload = JSON.stringify({
                "type": "BeginTyping",
                "channel": channel
            })

            if (this.debug) console.log(`[>>>] WS Module: Sending message to server, playload:\n${payload}`);

            ws.send(payload);
        }

        ws.on('message', (message) => {
            const msg = JSON.parse(message);
            if (msg.type == "Authenticated") {
                this.auth = true;
            }

            if (msg.type == "Ready") {
                this.emit('ready', msg);
            }

            if (msg.type == "Message") {
                this.emit('message', msg);
            }

            if (msg.type == "MessageDelete") {
                this.emit('messageDelete', msg);
            }
        })
    }
}
