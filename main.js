'use strict';
// ===== HTTP  =====
const fs = require('fs');
const http = require('http');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/ce.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};
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
    res.sendFile(path.join(__dirname, file));
    setTimeout(() => {
        fs.unlink(file, err => {
            if (err) logger.error(err);
                logger.info(`/img: [${uuid}] the image delete.`)
   	});
    }, 60000);
});

// ===== Front End =====
app.get('/', (req, res) => {
    res.send('Cloud Lady is working!');
});

// =====  Port =====
const  httpServer = http.createServer(app);
const  httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
