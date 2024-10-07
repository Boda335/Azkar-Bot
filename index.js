require("dotenv").config();
require("module-alias/register");
require("events").EventEmitter.setMaxListeners(999999999)
require("colors")
const DevXor = require("@DevXor/DevXor");
const { registerFont } = require('canvas');
const fontFile = './src/utils/fonts/Amiri-Regular.ttf';
registerFont(fontFile, { family: 'Amiri' });
let client = new DevXor({
  token: process.env.token, // token from your bot
  database: {
    database_type: "JSON", // "MONGODB"|"Sqlite"|"JSON"|"MySQL"
    MongoDB: {
      database: "DevXor",
      uri: "mongodb://0.0.0.0:27017",
    },
    options: {
      table: "NexusDB",
      nested: "..", //default use it 
      nestedIsEnabled: true, //default use it 
      cache: {
        capacity: 1024, //default use it 
        isEnabled: true, //default use
      },
    }
  }
});

client.botlogin(process.env.token);

module.exports = client;


//nodejs-events
process.on("unhandledRejection", e => {
  if (!e) retrun;
  console.log(e)
});

process.on("uncaughtException", e => {
  if (!e) return;
  console.log(e)
});

process.on("uncaughtExceptionMonitor", e => {
  if (!e) return
  console.log(e)
});

