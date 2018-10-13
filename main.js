'use strict';
// ===== Express =====
const express = require('express');
const app = express();

// ===== Require Packages ======
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('node-color-log');

// ===== Middleware =====
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// ===== API =====
app.use(
    '/api', 
    require('./api/classify'),
    require('./api/meow')
);

// ===== Image =====
app.get('/img', (req, res) => {
    const uuid = req.query.uuid;
    const file = `${uuid}.jpg`;
    res.sendFile(file);
    fs.unlink(file, err => {
        if (err) logger.error(err);
        logger.info(`/img: [${uuid}] the image delete.`)
    });
});

// ===== Front End =====
app.get('/', (req, res) => {
    res.send('Cloud Lady is working!');
});

// =====  Port =====
const port = 8000;
const server = app.listen(port, () => {
    logger.info(`Web server listening on: ${port}`);
});