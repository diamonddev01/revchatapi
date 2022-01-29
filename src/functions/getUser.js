const https = require('https');
const options = {
    hostname: 'api.revolt.chat',
    port: 443,
    method: 'GET'
}

module.exports = async (id, token) => {
    options['path'] = `/users/${id}`;
    options['headers'] = { 'x-bot-token': token };

    return new Promise((reso, rej) => {
        const req = https.request(options, res => {
            res.on('data', d => {
                y = d.toString();
                x = JSON.stringify(y);
                v = JSON.parse(x);
                v = JSON.parse(v);

                if (v.bot) {
                    v.isBot = true;
                } else {
                    v.isBot = false;
                }
                reso(v);
            })
        })

        req.on('error', error => {
            rej(error)
        })

        req.end()
    })
}
