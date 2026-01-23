const express = require("express");
// require('dotenv').config({ path: '../.env' });
import dotenv from 'dotenv';
import authRouter from "./routes/userAuth";
dotenv.config();
const main = require("./config/db")

const app = express();

app.use(express.json())



app.use("/auth" , authRouter)





const  serverConnect  = async () => {
  try {
       await main()
       console.log("Connected to db successfully.")

       app.listen(process.env.PORT , ()=> {
        console.log(`Listening at Port ${process.env.PORT}...`)
       })
  } catch (err) {
    console.log(err)
  }
}

serverConnect()

// main()
//   .then(() => {
//     console.log("DB CONNECTED");

//     app.listen(process.env.PORT, () => {
//       console.log(`Listening at Port ${process.env.PORT}...`);
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to DB:", err);
//   });
