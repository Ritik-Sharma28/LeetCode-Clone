import express from "express";
import 'dotenv/config';
import { authRouter } from "./routes/userAuth.js";
import cookieParser from "cookie-parser";
//dotenv.config();

import main from "./config/db.js"
import { redisClient } from "./config/redis.js";

const app = express();


app.use(express.json())
app.use(cookieParser())



app.use("/auth", authRouter)





const serverConnect = async () => {
  try {
    await Promise.all([main(), redisClient.connect()])
    console.log("Connected to db successfully.")

    app.listen(process.env.PORT, () => {
      console.log(`Listening at Port ${process.env.PORT}...`)
    })
  } catch (err) {
    console.log(err)
  }
}

serverConnect()

