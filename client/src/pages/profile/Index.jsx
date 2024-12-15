import { useAppStore } from "@/store"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { IoArrowBack } from "react-icons/io5"
import { Avatar } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Input } from "@/components/ui/input"
const Profile = () => {
    const navigate = useNavigate()
    const { userInfo, setUserInfo } = useAppStore()
    const { firstName, setFirstName } = useState("")
    const { lasttName, setLastName } = useState("")
    const { image, setImage } = useState(null)
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);


    const saveChanges = async () => { }

    return (
        <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
            <div className="flex flex-col gap-10 w-[80vW] md:w-max">
                <div>
                    <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
                </div>
                <div className="grid grid-cols-2">
                    <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}>
                        <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                            {
                                image ? (<AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" />) :
                                    (
                                        <div className={`h-32 w-32 uppercase md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                                            {
                                                firstName ? firstName.split("").shift()
                                                    : userInfo.email.split("").shift()
                                            }
                                        </div>
                                    )
                            }
                        </Avatar>
                        {
                            hovered && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full">
                                    {
                                        image ? (<FaTrash className="text-white text-3xl cursor-pointer" />) : (<FaPlus className="text-white text-3xl cursor-pointer" />)
                                    }
                                </div>
                            )
                        }
                        {/* <input type="text" name="" id="" /> */}
                    </div>
                    <div className="flex min-w-3 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                        <div className="w-full">
                            <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2ce3b] borded-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile