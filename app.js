/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//read env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

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

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Whitelist routes to access backend 
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

/* set cors access to backend server 
initialize after deploy of frontend server */
app.use(cors(corsOptions));

//add api logger for development environment
app.use(morgan('dev'));

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

// set up a route to redirect http to https
// app.use(function(request, response, next) {
//     if (process.env.NODE_ENV != 'development' && !request.secure) {
//        return response.redirect("https://" + request.headers.host + request.url);
//     }
//     next();
// });

//set init route link to /api/v1/---
app.use('/api/v1', routes);

//set error handler middleware to catch any Throw Custom Error
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server Is Up and Running`);
});

//Catch Any unhandled Rejection didn't catch an error
process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
    // Application specific logging, throwing an error, or other logic here
});