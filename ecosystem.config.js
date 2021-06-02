/* eslint-disable no-undef */
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    instances: "max",
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
    env_production: {
      NODE_ENV: process.env.NODE_ENV,
    }
  }]
};