const app = require("./src/app.js")
const connectDB = require("./src/config/database.js");

const PORT = 3000;




async function startServer(){
    try{
      await  connectDB();

      app.listen(PORT,()=>{
        console.log("app is listening")
      })
    }
    catch(err){
        console.log(err);
    }
}
startServer();

