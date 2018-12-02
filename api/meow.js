'use strict';

const express = require('express');
const app = express.Router();
const logger = require('node-color-log');
const util = require('util');
const exec = util.promisify(require('child_process').exec)
const uuidv1 = require('uuid/v1');
const path = require("path");

app.post('/meow', async (req, res) => {
    const uuid = uuidv1();
    logger.info(`/api/meow: [${uuid}] new request`);

    const info = req.body;

    const meow = path.join(__dirname, '../meow');
    const outputFile = path.join(__dirname, `../${uuid}.jpg`);
    // cats is the images folder, and 27 is quantity.
    const command = `${meow} bottom-mode cats/${Math.floor(Math.random()*48)}.jpg '${JSON.stringify(info)}' -o ${outputFile}`;
    const {
        stdout,
        stderr
    } = await exec(command);
    if (stderr) {
        logger.warn(`/api/meow: [${uuid}] return 400`);
        return res.status(400).send("meow creates image failed.");
    }
    logger.info(`/api/meow: [${uuid}] the image created.`)
    logger.info(`/api/meow: [${uuid}] return 200`);
    return res.status(200).json({
        uuid
    });
})

module.exports = app;
