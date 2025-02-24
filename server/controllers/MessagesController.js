import Message from "../models/MessagesModel.js"
import { mkdirSync, renameSync } from 'fs'
import { uploadAttachment } from "../utils/features.js"
export const getMessages = async (request, response, next) => {
    try {
        const user1 = request.userId
        const user2 = request.body.id


        if (!user1 || !user2) {
            return response.status(400).send('Both user IDs are required.')
        }


        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 })

        return response.status(200).json({ messages })

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}


export const uploadFile = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send('No file uploaded.')
        }
        console.log('init')

        const fileUrl = await uploadAttachment(request)
        console.log('init2')

        return response.status(200).json({ fileUrl })

        // const date = Date.now()
        // let fileDir = `uploads/files/${date}`
        // let fileName = `${fileDir}/${request.file.originalname}`

        // mkdirSync(fileDir, { recursive: true })

        // renameSync(request.file.path, fileName)

        // return response.status(200).json({ filePath: fileName })

    } catch (error) {
        if (error.http_code === 400) {
            return response.status(401).send('File is too large.')
        }
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}