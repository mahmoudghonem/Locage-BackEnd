/* eslint-disable no-undef */
module.exports = {
  apps : [{
    name: "Locage",
    script: "./app.js",
    instances: "max",
    exec_mode : "cluster",
  }]
};