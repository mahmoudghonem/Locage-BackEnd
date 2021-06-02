/* eslint-disable no-undef */
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    instances: "max",
    watch: true,
    ignore_watch : ["node_modules"],
    kill_timeout : 3000,
    env: {
      NODE_ENV: process.env.NODE_ENV,
    },
    env_production: {
      NODE_ENV: process.env.NODE_ENV,
    }
  }]
};