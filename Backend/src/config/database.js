const config = require("./config.js")

const mongoose = require("mongoose")

async function main() {

  await mongoose.connect(config.MONGO_URI);
  console.log("connections successful");

}



module.exports = main;