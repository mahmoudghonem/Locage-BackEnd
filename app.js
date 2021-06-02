/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//read env variables
require('dotenv').config();

//required imports
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const path = require("path");
const helmet = require('helmet');
const CustomError = require('./functions/errorHandler');
const { mongoose } = require('./loaders/db');

//Config all routes in routes/index.js
const routes = require('./routes');

//init express servers
const app = express();

//add api logger for development environment
app.use(morgan('tiny'));

//Whitelist routes to access backend 
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

/* set cors access to backend server 
initialize after deploy of frontend server */
app.use(cors(corsOptions));

/*
Adding security reinforce 
setting contentSecurityPolicy
setting dnsPrefetchControl
setting expectCt
setting frameguard
setting hidePoweredBy
setting hsts
setting ieNoOpen
setting noSniff
setting permittedCrossDomainPolicies
setting referrerPolicy
setting xssFilter
*/
app.use(helmet());

//use compression middleware to reduce data bandwidth
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }
    // fallback to standard filter function
    return compression.filter(req, res);
}

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//set init route link to /api/v1/---
app.use('/api/v1', routes);

//set error handler middleware to catch any Throw Custom Error
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    res.status(status).json({ message: message });
});

const HTTPSPORT = process.env.NODE_ENV == 'development' ? 3000 : process.env.PORT;

app.listen(HTTPSPORT, () => {
    console.log(`Server Is Working On Port ${HTTPSPORT}`);
});

//Catch Any unhandled Rejection didn't catch an error
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});