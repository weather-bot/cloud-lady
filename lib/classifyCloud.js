'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const axios = require("axios");
const logger = require('node-color-log');

// context = {
//     platform,
//     id,
//     token,
// }
async function getCloudImg(uuid, context) {
    if (context.platform == "line") {
        try {
            const res = await axios({
                method: 'get',
                url: `https://api.line.me/v2/bot/message/${context.id}/content`,
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${context.token}`
                }
            });
            return res.data;
        } catch (err) {
            logger.error(`[${uuid}] ${err}`);
            return null;
        }
    } else if (context.platform == "telegram") {
        try {
            const url1 = `https://api.telegram.org/bot${context.token}/getFile?file_id=${context.id}`;
            const res1 = await axios.get(url1);
            const fileInfo = res1.data.result;
            const url2 = `https://api.telegram.org/file/bot${context.token}/${fileInfo.file_path}`;
            const res2 = await axios.get(url2, {
                responseType: 'arraybuffer'
            });
            return res2.data;
        } catch (err) {
            logger.error(`[${uuid}] ${err}`);
            return null;
        }
    } else { // not support this platform
        return null;
    }
}

// Excute python to run DL
async function getCloudImgResult(uuid, filePath) {
    const pythonScript = path.join(__dirname, '../python/script/label_image.py');
    const labelFile = path.join(__dirname, '../python/model/retrained_labels.txt');
    const graphFile = path.join(__dirname, '../python/model/retrained_graph.pb');
    const command = `python ${pythonScript} ${filePath} ${labelFile} ${graphFile}`;
    const {
        stdout,
        stderr
    } = await exec(command);
    if (stderr) {
        logger.error(`[${uuid}] ${stderr}`);
        return null;
    }
    logger.info(`[${uuid}] ${stdout}`);
    return JSON.parse(stdout);
}

async function main(uuid, context) {
    logger.info(`[${uuid}] <${context.platform}> <${context.id}>`)
    logger.info(`[${uuid}] start downloading image`)
    const imgBin = await getCloudImg(uuid, context);
    if (!imgBin) {
        return null;
    }
    const fileName = `${(new Date()).getTime()}-${context.platform}.jpg`;
    logger.info(`[${uuid}] resize the image`)    
    await sharp(imgBin).resize(400).toFile(fileName).catch(e => console.log(e));
    logger.info(`[${uuid}] run tensorflow to classify the image`)        
    const result = await getCloudImgResult(uuid, fileName);
    // We don't need to wait for file deletion.
    // Therefor we do not use `unlinkSync` here.
    fs.unlink(fileName, err => {
        if (err) logger.error(err);
        logger.info(`[${uuid}] the image delete.`)    
    });
    return result;
}

module.exports = main;