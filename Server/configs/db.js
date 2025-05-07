//This is Configuration file used for connect to database to server by mongoose;
const mongoose = require("mongoose");
const { envFile } = require("./env.config");

mongoose.set('debug', true);
    
const connection = mongoose.connect(envFile.DB_URL  );

module.exports = { connection };
