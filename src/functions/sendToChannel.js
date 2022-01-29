const https = require('https');
const options = {
    hostname: 'api.revolt.chat',
    port: 443,
    method: 'POST'
}

module.exports = async (channel, object, token) => {
    options['path'] = `/channels/${channel}/messages`;

    const content = {
        content: object.content,
        attatchments: object.attatchments,
        embeds: object.embeds,
        replies: object.replies,
        masquerade: object.masq
    }

    options['headers'] = { 'x-bot-token': token, 'Content-Length': JSON.stringify(content).length, 'Content-Type': 'application/json' };

    return new Promise((reso, rej) => {
        const req = https.request(options, res => {
            res.on('data', d => {
                y = d.toString();
                x = JSON.stringify(y);
                v = JSON.parse(x);
                if (v.startsWith('<')) return {};
                v = JSON.parse(v);
                reso(v);
            })
        })

        req.on('error', error => {
            rej(error)
        })

        req.write(JSON.stringify(content));
        req.end()
    })
}
