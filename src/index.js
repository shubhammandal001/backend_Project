//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./.env"
}
);


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000 ,()=>{
       
        console.log(`* server is running at port : ${process.env.PORT}`);
        
    } )
})
.catch((error)=>{
    
    console.log("MongoDB connectin failed !!",error);
    
})