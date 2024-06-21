var configCommand = {
    name: 'auto',
    version: '1.1.1',
    hasPermssion: 2,
    credits: 'DC-Nam mod by DongDev',
    description: 'Tự động tải xuống khi phát hiện liên kết',
    commandCategory: 'Tiện ích',
    usages: '[]',
    cooldowns: 2,
    images: [],
};
const axios = require('axios');
const fse = require('fs-extra');
const path = __dirname+'/data/autodown.json';

let streamURL = (url, ext = 'jpg') => require('axios').get(url, {
    responseType: 'stream',
}).then(res => (res.data.path = `tmp.${ext}`, res.data)).catch(e => null);

function onLoad() {
    if (!fse.existsSync(path)) fse.writeFileSync(path, '{}');
};

function convertSecondsToHMS(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const remainingSeconds = String(Math.floor(seconds % 60)).padStart(2, '0');
    return `${hours}:${minutes}:${remainingSeconds}`;
}

async function noprefix(arg) {
    const s = JSON.parse(fse.readFileSync(path));
    const cookiess = require('./../../config.json');
              
    if (arg.event.senderID == (global.botID || arg.api.getCurrentUserID())) return;
    if ((typeof s[arg.event.threadID] == 'boolean' && !s[arg.event.threadID])) return;

    const out = (a, b, c, d) => arg.api.sendMessage(a, b?b: arg.event.threadID, c?c: null, d?d: arg.event.messageID),
    arr = arg.event.args,
    regEx_tiktok = /(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//,
    
regEx_youtube = /(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//,
    regEx_facebook = /(^https:\/\/)(\w+\.)?(facebook|fb)\.(com|watch)\/((story\.php|page\.\w+)(\?|\/))?(story_fbid=|\w+\/)/,
    regEx_stotyfb = /(^https:\/\/)(www\.)?facebook\.com\/stories\/\d+\/[A-Za-z0-9_-]+=/,
    regEx_reelfb = /^https:\/\/(?:www\.)?facebook\.com\/(reel|share)\/\d+(?:\?mibextid=[\w\d]+)?$/i,
    regEx_fbwatch = /^https:\/\/fb\.watch\/\w+\/(\?\w+=\w+)?$/,
    regEx_instagram = /^\u0068\u0074\u0074\u0070\u0073\u003a\/\/(www\.)?instagram\.com\/(reel|p)\/\w+\/\w*/,
    regEx_capcut = /(^https:\/\/)((www)\.)?(capcut)\.(com)\//,
    regEx_imgur = /(^https:\/\/)((www|i)\.)?(imgur)\.(com)\//,
    regEx_soundcloud = /(^https:\/\/)((on)\.)?(soundcloud)\.(com)\//,
    regEx_zingmp3 = /(^https:\/\/)((www|mp3)\.)?(zing)\.(vn)\//,
    regEx_spotify = /(^https:\/\/)((www|open|play)\.)?(spotify)\.(com)\//,
    regEx_twitter = /(^https:\/\/)((www|mobile|web)\.)?(twitter|x)\.(com)\//,
    regEx_mediafire = /(^https:\/\/)((www|download)\.)?(mediafire)\.(com)\//,
    regEx_imgbb = /(^https:\/\/)((i)\.)?(ibb)\.(co)\//,
    regEx_filecatbox = /(^https:\/\/)((files)\.)?(catbox)\.(moe)\//,
    regEx_pinterest = /(^https:\/\/)(pin)\.(it)\//
for (const el of arr) {
  if (regEx_tiktok.test(el)) {
   const platform = el.includes("tiktok") ? "TIKTOK" : "DOUYIN";
   const data = (await axios.post(`https://www.tikwm.com/api/`, { url: el })).data.data;
   out({body: `Tiêu Đề: ${data.title}\nLượt Thích: ${data.digg_count}\nTác giả: ${data.author.nickname} (${data.author.unique_id})`, attachment: (data.images?await Promise.all(data.images.map($=>streamURL($))):await streamURL(data.play, 'mp4')),}, '', (err, dataMsg) => global.client.handleReaction.push({
                    name: configCommand.name, messageID: dataMsg.messageID, url: data.music
                })); // Video không logo thì sửa "wmplay" -> "play";
        };
        /* END */
   /* END */
/* Tự Động Tải Video YouTube */
if (regEx_youtube.test(el)) {
    const ytdl = require('ytdl-core');
    const info = await ytdl.getInfo(el);
    const format = info.formats.find((f) => f.qualityLabel && f.qualityLabel.includes('360p') && f.audioBitrate);
    const formatvd = ytdl.chooseFormat(info.formats, { quality: '18' });
   const formatmp3 = ytdl.chooseFormat(info.formats, { quality: '140' });

const formattedTime = convertSecondsToHMS(info.videoDetails.lengthSeconds);
  
const inputTime = info.videoDetails.uploadDate;
const outputTimeZone = 'Asia/Ho_Chi_Minh';
const convertedTime = moment(inputTime).tz(outputTimeZone).format('DD/MM/YYYY');
  
    if (format) {
        const response = await axios.get(formatvd.url, { responseType: 'stream' });
   const attachmentData = response.data;
      out({
            body: `[ YOUTUBE ]\n📝 Tiêu đề: ${info.videoDetails.title}\n⏳ Thời lượng: ${formattedTime}\n👤 Tên kênh: ${info.videoDetails.ownerChannelName}\n📅 Ngày tải lên: ${convertedTime}\n🔎 Lượt xem: ${info.videoDetails.viewCount}\n"😆" để tải nhạc`,
            attachment: attachmentData,
        }, '', (err, dataMsg) => global.client.handleReaction.push({
            name: configCommand.name,
            messageID: dataMsg.messageID,
            url: formatmp3.url,
        }));
    }
};
  /* END */
/* 𝙏𝙪̛̣ 𝙙𝙤̣̂𝙣𝙜 𝙩𝙖̉𝙞 nhạc Spotify 🌹*/
      /*if (regEx_spotify.test(el)) out({
          attachment: await streamURL((fdl = (await axios.get(`${global.config.configApi.link[0]}/youtube/download?&apikey=${global.config.configApi.key[0]}&id=${el}`)).data.result, fdl.preview_audio), 'mp3'), body: `[ SPOTIFY ]\n📝 Tên bài: ${fdl.name}`
      }, '', (err, dataMsg) => global.client.handleReaction.push({
              name: configCommand.name, messageID: dataMsg.messageID, url: fdl.music.play_url
          }));*/
      /* END */
            /* 𝙏𝙪̛̣ 𝙙𝙤̣̂𝙣𝙜 𝙩𝙖̉𝙞 Video twitter 🌹*/
      /*if (regEx_twitter.test(el)) out({
          attachment: await streamURL((fdl = (await axios.get(`${global.config.configApi.link[1]}/api/twitterDL?url=${el}&apikey=${global.config.configApi.key[1]}`)).data.result, fdl.HD), 'mp4'), body: `[ TWITTER ]\n📝 Tiêu đề: ${fdl.desc}`
      }, '', (err, dataMsg) => global.client.handleReaction.push({
              name: configCommand.name, messageID: dataMsg.messageID, url: fdl.audio
          }));*/
      /* END */
/* TỰ ĐỘNG TẢI VD STORY FACEBOOK */
if (regEx_reelfb.test(el)) {
  const fbvideo = require("./../../includes/DATA/EX/data_api/fbvideo.js");
  const cookie = cookiess.cookie;
  const videoUrl = el;
  const result = await fbvideo(videoUrl, cookie);
  const res = result.link;
  const title = result.title;
  const response = await axios.get(res, { responseType: 'stream' });
  out({
    body: `[ FACEBOOK ]\n📝 Title: ${title}`,
    attachment: response.data
    });
};
/* END */
   /* 𝙏𝙪̛̣ 𝙙𝙤̣̂𝙣𝙜 𝙩𝙖̉𝙞 link mediafire 🌹*/
   /*if (regEx_mediafire.test(el)) {
            const res = (await axios.get(`${global.config.configApi.link[1]}/api/mediafireDL?url=${el}/file&apikey=${global.config.configApi.key[1]}`)).data.result;
            out({body: `[ MEDIAFIRE ]\n📝 Title: ${res.title}\n🔁 Kích thước: ${res.size}\n📎 Link download: ${res.link}`
        })
      };*/
      /* END */
    /* Tự động tải Ảnh Imgbb*/
   /*       if (regEx_imgbb.test(el)) {
let data = (await axios.get(el, { responseType: "stream" })).data;
            out({body: `:b`, attachment: data
           })     
      };*/
     /* END */
if (regEx_fbwatch.test(el)) {
 const res = await axios.get(`https://apidown.site/api/facebook/media?url=${el}`);
   out({body: `[ FACEBOOK ]\n📝 Tiêu đề: ${res.videos[0].title}`, attachment: await streamURL(res.videos[0].url, 'mp4')});
  };
  /* Tự động tải ảnh pinterest*/
  if (regEx_pinterest.test(el)) {
 const res = await axios.get(`https://api.imgbb.com/1/upload?key=588779c93c7187148b4fa9b7e9815da9&image=${el}`);
   out({body: `:b`, attachment: await streamURL(res.data.data.image.url, 'jpg')});
  };
        /* Tự động tải Ảnh hoặc vd imgur*/
     /*     if (regEx_imgur.test(el)) {
let data = (await axios.get(el, { responseType: "stream" })).data;
            out({body: `:b`, attachment: data
           })     
      };*/
  /* END */
  /* Tự động tải ảnh hoặc vd file catbox*/
          if (regEx_filecatbox.test(el)) {
let data = (await axios.get(el, { responseType: "stream" })).data;
            out({body: `:b`, attachment: data
           })     
      };
      /* END */
/*  Tự Động Tải Nhạc Zingmp3 */
if (regEx_zingmp3.test(el)) {
  const matchResult = el.match(/\/([a-zA-Z0-9]+)\.html/) || el.match(/([a-zA-Z0-9]+)$/);
    const id = matchResult?.[1];
    const response = await axios.get(`http://api.mp3.zing.vn/api/streaming/audio/${id}/128`, {
      responseType: 'stream'
    });
  out({body: `[ ZINGMP3 ]`,
      attachment: response.data
    });
};
   /* END */
/* Tự động tải vd capcut */
if (regEx_capcut.test(el)) {
    const capcutdl = require('./../../includes/DATA/EX/data_api/capcut.js');
    const url = el;
    const result = await capcutdl(url);
    const videoURL = result[0].video; 
        out({
          body: `[ CAPCUT ]\n📝 Tiêu đề: ${result[0].title}\n😻 Mô tả: ${result[0].description}\n🌸 Lượt dùng: ${result[0].usage}\n🧸 Link mẫu: ${result[0].urlVideo}`, attachment: await streamURL(videoURL, 'mp4')});
   };
        /* END */
     /*  𝙏𝙪̛̣ 𝙙𝙤̣̂𝙣𝙜 𝙩𝙖̉𝙞 nhạc SoundCloud 🌵 */
        /*if (regEx_soundcloud.test(el)) out({
            attachment: await streamURL((fdl = (await axios.get(`${global.config.configApi.link[1]}/api/autolink?url=${el}/&apikey=${global.config.configApi.key[1]}`)).data.result, fdl.music.play_url), 'mp3'), body: `[ SOUNDCLOUD ] - Tự Động Tải\n\n📝 Tiêu đề:  ${fdl.desc}\n⏳ Thời gian ${fdl.duration}\n──────────────────\n📺 Đây là tính năng tự động tải khi phát hiện link`
        }, '', (err, dataMsg) => global.client.handleReaction.push({
                name: configCommand.name, messageID: dataMsg.messageID, url: fdl.url
            }));*/
        /* END */
/* Tự động tải Post Instagram*/
    if (regEx_instagram.test(el)) {
    const { igdl } = require('./../../includes/DATA/EX/data_api/igdl.js');
    const url = el;
    const res = await igdl(url);
    let vd = res.filter($ => $.type === 'video');
    let pt = res.filter($ => $.type === 'image');

    let s = attachment => out({ body: `[ INSTAGRAM ]`, attachment,}, '', (err, dataMsg) => global.client.handleReaction.push({
        name: configCommand.name, messageID: dataMsg.messageID, url_audio: null
   }));
    Promise.all(vd.map($ => streamURL($.url, 'mp4'))).then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
    Promise.all(pt.map($ => streamURL($.url, 'jpg'))).then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
      }
   }
};
/* END */
async function reactionMsg(arg) {
  if(arg.event.reaction == '😆'){
    const out = (a, b, c, d) => arg.api.sendMessage(a, b?b: arg.event.threadID, c?c: null, d),
    _ = arg.handleReaction;
    if ('url'in _) out({
        body: `[ MP3 ]`, attachment: await streamURL(_.url, 'mp3')}, '', '', _.messageID);
     }
};
function runCommand(arg) {
    const out = (a, b, c, d) => arg.api.sendMessage(a, b?b: arg.event.threadID, c?c: null, d?d: arg.event.messageID);
    const data = JSON.parse(fse.readFileSync(path));
    s = data[arg.event.threadID] = typeof data[arg.event.threadID] != 'boolean'||!!data[arg.event.threadID]?false: true;
    fse.writeFileSync(path, JSON.stringify(data, 0, 4));
    out((s?'Bật': 'Tắt')+" Tự Động Tải");
};

module.exports = {
    config: configCommand,
    onLoad,
    run: runCommand,
    handleEvent: noprefix,
    handleReaction: reactionMsg
};