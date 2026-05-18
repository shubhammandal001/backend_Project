import mongoose from "mongoose"
import { DB_NAME } from "../costants.js"

const connectDB = async () => {
    try {

        const conactionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_NAME}`)
        console.log(` \n MongoDB connected !! DB Host : ${conactionInstance.connection.host}`);
        //console.log(conactionInstance);
        //console.log("ENV CHECK ",process.env.DATABASE_URI);
          
    } catch (error) {
        console.log("MongoDB connection Error !!", error);
        process.exit(1)
    }
}

export default connectDB