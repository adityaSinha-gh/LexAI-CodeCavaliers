const dotenv = require("dotenv")

dotenv.config();

if(!process.env.MONGO_URI){
    throw new Error("file does not exist");

}
if(!process.env.PORT){
    throw new Error("Port does not exist")
}

const config = {
    MONGO_URI :process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    PORT:process.env.PORT
}


module.exports = config;