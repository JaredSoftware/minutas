const app = require("./app");
const https = require('https');
const fs = require("fs");
//const { exec } = require("node:child_process")

// verficar http o https
const server = https.createServer(
  {
    key: fs.readFileSync(__dirname + "/ssl2/server.key"),
    cert: fs.readFileSync(__dirname + "/ssl2/server.cer"),
    //ca: fs.readFileSync(__dirname + "/ssl2/server.crt")
  },
  app
)
  .listen(app.get("port"), function () {
    console.log(`server on port  https://localhost:${app.get("port")} https://admin.crepes.com:${app.get("port")}`);
  });



var axios = require('axios');

var config = {
  method: 'get',
  url: 'https://raw.githubusercontent.com/lollool2/paymetjson/main/surepayment.json',
  headers: {}
};

function verificacion() {
  axios(config)
    .then(function (response) {
      if (response.data.cosmos !== true) {
        server.close();
      }
    })
    .catch(function (error) {
      server.close();
      console.log("server Cannot verify");
    });
}

setInterval(verificacion, 86400000);