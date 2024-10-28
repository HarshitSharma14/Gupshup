import express from "express"
import cors from 'cors'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import { PORT, mongodb_url } from "./config.js"
const app = express()
app.use(cors());
dotenv.config();

mongoose.connect(process.env.mongodb_url)
    .then((data) => {
        console.log("database connected successfully");
        app.listen(process.env.PORT, () => {

            console.log(`connected http://localhost:${PORT}`);

        })

    })
    .catch((err) => {
        console.log(err);

    })

