/* eslint-disable no-undef */
module.exports = {
  apps : [{
    name: "Locage",
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