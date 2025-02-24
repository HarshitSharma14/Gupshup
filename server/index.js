import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import authRoutes from "./routes/AuthRoutes.js"
import contactsRoutes from "./routes/ContactRoutes.js"
import setupSocket from "./socket.js"
import messagesRoutes from "./routes/MessagesRoutes.js"
import channelRoutes from "./routes/ChannelRoutes.js"
import cloudinary from "cloudinary";
import Redis from "ioredis";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL


// export const redis = new Redis(process.env.REDIS_URL, {
//     tls: { rejectUnauthorized: false }, // Allow self-signed certs
//     retryStrategy: (times) => Math.min(times * 50, 2000) // Exponential backoff
// });

export const redis = new Redis(process.env.REDIS_URL, {
    retryStrategy: (times) => Math.min(times * 50, 2000) // Exponential backoff
});


redis.on('connect', () => console.log('Connected to Redis on Render'));
redis.on('error', (err) => console.error('Redis Error:', err));

app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}))

//cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    timeout: 60 * 60 * 1000 * 4,
});


app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/contacts", contactsRoutes)
app.use("/api/messages", messagesRoutes)
app.use("/uploads/profiles", express.static("uploads/profiles"))
app.use("/uploads/files", express.static("uploads/files"))
app.use("/api/channel", channelRoutes)
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)

    mongoose.connect(databaseURL).then(() => console.log('DB Connection success'))
        .catch(e => console.log(e.message))

})

setupSocket(server)


