'use strict';

const express = require('express');
const app = express.Router();
const logger = require('node-color-log');
const uuidv1 = require('uuid/v1');

app.post('/classify', async (req, res) => {
    const uuid = uuidv1();
    logger.info(`/api/classify: [${uuid}] new request`);
    
    const context = req.body;
    
    if(!(context.platform && context.id && context.token)){
        logger.info(`/api/classify: [${uuid}] return 400`);
        return res.status(400).send("body wrong");
    }
    
    const result = await require('../lib/classifyCloud')(uuid, context);
    if(!result){
        logger.warn(`/api/classify: [${uuid}] return 400`);
        return res.status(400).send("classify failed.");
    }
    
    logger.info(`[${uuid}] return 200`);    
    return res.status(200).send(result);
})

module.exports = app;