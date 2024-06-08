import dotenv from "dotenv"
import { app } from "./app.js"
import { connectDB } from "./DB/connectDb.js"
dotenv.config({
    path: "./.env"
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8081, () => {
            console.log(`Server is running at the port ${process.env.PORT}`)
        })
    })
    .catch((err) => { console.log("MONGODB CONNECTION FAILED", err) })
