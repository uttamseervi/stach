import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
        console.log("MongoDb connected !! DB host ", connectionInstance.connection.host)
    } catch (error) {
        console.log("MONGODB connection failed", error);
        process.exit(1);
    }
}
export {connectDB}