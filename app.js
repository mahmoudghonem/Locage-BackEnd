/* eslint-disable no-unused-vars */
//read env variables
require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const CustomError = require('./functions/errorHandler');
// eslint-disable-next-line no-unused-vars
const { mongoose } = require('./loaders/db');
//get all routes from routes/index.js
const routes = require('./routes')
//init express servers
const app = express();

//add apis logger for development environment
app.use(morgan('dev'));
//add cors access
app.use(cors());
//add security reforce
app.use(helmet());
//use compression middelware to reduce data bandwidth
app.use(compression({ filter: shouldCompress }))
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res)
}
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
//set init route link to /api/v1/---
app.use('/api/v1/', routes);
//set not found router middleware
app.use((req, res, next) => {
    new CustomError('NOT_FOUND', 404);
    new Error
})
//set error handler middleware
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({ message: message });
});
//reading ssl credentials to enable https servers
// eslint-disable-next-line no-undef
var key = fs.readFileSync('./certs/selfsigned.key');
// eslint-disable-next-line no-undef
var cert = fs.readFileSync('./certs/selfsigned.crt');
var credentials = {
    key: key,
    cert: cert
};
//create express server
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
// eslint-disable-next-line no-undef
const HTTPPORT = process.env.NODE_ENV == 'development' ? 8080 : process.env.HTTPPORT;
// eslint-disable-next-line no-undef
const HTTPSPORT = process.env.NODE_ENV == 'development' ? 8443 : process.env.HTTPSPORT;
httpServer.listen(HTTPPORT, () => {
    console.log(`Server Is Working On Http Port http://localhost:${HTTPPORT}`);
});
httpsServer.listen(HTTPSPORT, () => {
    console.log(`Server Is Working On Https Port https://localhost:${HTTPSPORT}`);
});
