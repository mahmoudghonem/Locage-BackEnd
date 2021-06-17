/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

//read env variables
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

//required imports
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const CustomError = require('./functions/errorHandler');
const { mongoose } = require('./loaders/db');

//Config all routes in routes/index.js
const routes = require('./routes');

//init express servers
const app = express();

// Add cors headers middleware
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

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
app.use(express.json({ limit: '50mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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