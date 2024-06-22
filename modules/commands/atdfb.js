const axios = require('axios');
const fs = require('fs');

const isURL = u => /^http(|s):\/\//.test(u);

async function handleEvent(o) {
    try {
        const str = o.event.body;
        const send = msg => o.api.sendMessage(msg, o.event.threadID);
        const head = app => `${app.toUpperCase()} tiêu đề:\n\n`;

        if (isURL(str)) {
            if (/fb|facebook/.test(str)) {
                const json = await infoPostFb(str);
                const body = `===== [ Facebook ]====\nTiêu đề: ${json.message}`;
                const fil = type => json.attachment.filter($ => $.__typename == type);
                const photo = fil('Photo');
                const video = fil('Video');

                const attachment = [];
                for (const i of photo) {
                    try {
                        const img = i.photo_image || i.image || {};
                        attachment.push(await streamURL(img.uri, 'jpg'));
                    } catch (error) {
                        console.error('Error handling photo attachment:', error);
                        continue;
                    }
                }

                if (attachment.length > 0) {
                    await send({
                        body,
                        attachment
                    });
                }

                for (const i of video) {
                    try {
                        send({
                            body,
                            attachment: await streamURL(i.playable_url_quality_hd || i.playable_url, 'mp4'),
                        });
                    } catch (error) {
                        console.error('Error handling video attachment:', error);
                        continue;
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error handling event:', error);
    }
}

exports.handleEvent = handleEvent;

exports.run = () => {};

exports.config = {
    name: 'autodownfb',
    version: '1',
    hasPermission: 0,
    credits: 'Sơnkb',
    description: 'Tự động download ',
    commandCategory: 'Tiện ích',
    usages: [],
    cooldowns: 3
};

function streamURL(url, type) {
    return axios.get(url, {
        responseType: 'arraybuffer'
    }).then(res => {
        const path = __dirname + `/cache/${Date.now()}.${type}`;
        fs.writeFileSync(path, res.data);
        setTimeout(p => fs.unlinkSync(p), 1000 * 60, path);
        return fs.createReadStream(path);
    });
}

function infoPostFb(url) {
    return axios.get(`https://j2download.net/api/facebook/media?url=${url}`).then(res => res.data);
}
