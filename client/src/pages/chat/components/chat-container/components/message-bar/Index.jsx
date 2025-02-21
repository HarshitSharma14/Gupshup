import { useSocket } from "@/context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useState, useRef, useEffect } from "react";
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
const MessageBar = () => {
    const socket = useSocket()
    const fileInputRef = useRef()
    const [message, setMessage] = useState('');
    const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore()
    const emojiRef = useRef()
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

    const handleSendMessage = async (e) => {
        e.preventDefault()
        if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
                sender: userInfo.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined
            })
        }
        else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
                sender: userInfo.id,
                content: message,
                messageType: "text",
                fileUrl: undefined,
                channelId: selectedChatData._id
            })
        }
        setMessage("")
    }

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [emojiRef])

    const handleAttachmentClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleAttachmentChange = async (event) => {
        try {
            const file = event.target.files[0]
            if (file) {
                const formData = new FormData()
                formData.append('file', file)
                setIsUploading(true)
                const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
                    withCredentials: true,
                    onUploadProgress: data => {
                        setFileUploadProgress(Math.round((100 * data.loaded) / data.total))
                    }
                })


                if (response.status === 200 && response.data) {
                    setIsUploading(false)
                    if (selectedChatType === "contact") {
                        socket.emit("sendMessage", {
                            sender: userInfo.id,
                            content: undefined,
                            recipient: selectedChatData._id,
                            messageType: "file",
                            fileUrl: response.data.filePath
                        })
                    }
                    else if (selectedChatType === "channel") {
                        socket.emit("send-channel-message", {
                            sender: userInfo.id,
                            content: undefined,
                            messageType: "file",
                            fileUrl: response.data.filePath,
                            channelId: selectedChatData._id
                        })
                    }

                }
            }
            // console.log({ file })
        }
        catch (error) {
            setIsUploading(false)
            console.log(error)
        }
    }


    return (
        <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">

            <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 ">
                <form onSubmit={handleSendMessage} className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none" >

                    <input type="text" className="w-full flex-1 p-0 bg-transparent rounded-md focus:border-none focus:outline-none"
                        placeholder="Enter Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                </form>

                <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttachmentClick} >
                    <GrAttachment className="text-2xl" />
                </button>
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttachmentChange} />
                <div className="relative">
                    <button className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className="text-2xl" />
                    </button>
                    <div className="absolute bottom-16 right-8" ref={emojiRef}>
                        <EmojiPicker theme="dark" open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button className="bg-[#8417ff] rounded-md flex items-center justify-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleSendMessage}>
                <IoSend className="text-2xl" />
            </button>
        </div>
    )
}

export default MessageBar 