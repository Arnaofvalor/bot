const axios = require('axios');
const fs = require('fs');

const isURL = u => /^http(|s):\/\//.test(u);

exports.handleEvent = async function(o) {
    try {
        const str = o.event.body;
        const send = msg => o.api.sendMessage(msg, o.event.threadID);
        //const head = app => `==『 AUTODOWN ${app.toUpperCase()} 』==\n────────────────`;
      const head = app => '';

        if (isURL(str)) {
            if (/fb|facebook/.test(str)) {
                const json = await infoPostFb(str);
                const body = `${head('')}- Tiêu Đề: ${json.message}`;
                const fil = type => json.attachment.filter($=>$.__typename == type);
                const photo = fil('Photo');
                const video = fil('Video');

                const attachment = [];
                for (const i of photo) {
                    try {
                        const img = i.photo_image || i.image || {};
                        attachment.push(await streamURL(img.uri, 'jpg'));
                    } catch {
                        continue;
                    }
                }
                if (attachment.length > 0) {
                    await send({
                        body, attachment
                    });
                }

                for (const i of video) {
                    try {
                        send({
                            body, attachment: await streamURL(i.browser_native_hd_url || i.browser_native_sd_url, 'mp4'),
                        });
                    } catch {
                        continue;
                    }
                }
            } 
      /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO TIKTOK */ 
      else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
                const json = await infoPostTT(str);
                let attachment = [];
                if (json.images != undefined) {
                    for (const $ of json.images) {
                        attachment.push(await streamURL($, 'png'));
                    }
                } else {
                    attachment = await streamURL(json.play, 'mp4');
                }

                send({
                    body: `${head('')}\nTiêu Đề : ${json.title}`, attachment
                });
            } 
           /* TỰ ĐỘNG TẢI ẢNH HOẶC VIDEO INSTAGRAM */ 
            else if (/instagram\.com/.test(str)) {
                const res = await axios.get(`http://apidown.site/api/down/media?url=${str}`);
                const {
                    videos = [{}],
                    images
                } = res.data;
                let attachment = [];

                if (videos[0] != undefined) {
                    attachment = await streamURL(videos[0], 'mp4');
                } else if (images != undefined) {
                    for (const $ of typeof images == 'string' ? [images]: images) {
                        attachment.push(await streamURL($, 'png'));
                    }
                }
                send({
                    body: `${head('')}\n Tiêu Đề: ${res.data.caption}`, attachment
                });
            }
        }

    } catch(e) {
        console.log('Error', e);
    }
};
exports.run = () => {};
exports.config = {
    name: 'atd',
    version: '1',
    hasPermssion: 0,
    credits: 'Công Nam',
    description: '',
    commandCategory: 'Tiện Ích',
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

function infoPostTT(url) {
    return axios({
        method: 'post',
        url: `https://tikwm.com/api/`,
        data: {
            url
        },
        headers: {
            'content-type': 'application/json'
        }
    }).then(res => res.data.data);
}

function infoPostFb(url) {
    return axios.get(`https://j2download.net/api/facebook/media?url=${url}`).then(res => res.data);
  
                  }
