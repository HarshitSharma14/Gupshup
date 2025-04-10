import Background from "@/assets/login2.png"
import Victory from "@/assets/victory.svg"
import { Button } from "@/components/ui/button";
import { TabsContent, TabsTrigger } from "@radix-ui/react-tabs";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client"
import { LOGIN_ROUTE, SEND_OTP_ROUTE, SIGNUP_ROUTE, VERIFY_OTP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
    const navigate = useNavigate()

    const { setUserInfo } = useAppStore()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpVerified, setOtpVerified] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [disableButton, setDisableButton] = useState(false)
    const validateLogin = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.length) {
            toast.error("Email is required.")
            return false
        }
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email.");
            return false;
        }
        if (!password.length) {
            toast.error("Passowrd is required.")
            return false
        }

        return true
    }

    const validateSignup = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.length) {
            toast.error("Email is required.")
            return false
        }
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email.");
            return false;
        }
        if (!password.length) {
            toast.error("Passowrd is required.")
            return false
        }
        if (password !== confirmPassword) {
            toast.error("Passowrd and confirm password should be same.")
            return false
        }
        return true
    }

    const sendOtp = async () => {
        setDisableButton(true)
        const toastId = toast.loading("Sending OTP...");
        console.log('init')
        if (validateSignup) {
            try {
                const response = await apiClient.post(SEND_OTP_ROUTE, { email })
                if (response.status === 200) {
                    toast.success("OTP sent successfully!", { id: toastId });
                    console.log('sent')
                    setOtpSent(true)
                }
                else {
                    toast.error("Failed to send OTP", { id: toastId });
                }
                console.log('idk why')
            }
            catch (e) {
                if (e.status === 409) {
                    toast.error("User already signed up. Please Log in!", { id: toastId });
                }
                else {
                    toast.error("Something went wrong!", { id: toastId });
                }
            }
        }
        console.log('here')
        setDisableButton(false)
    }

    const handleLogin = async () => {
        setDisableButton(true)
        if (validateLogin()) {
            try {
                const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true })

                if (response.data.user.id) {
                    setUserInfo(response.data.user)
                    if (response.data.user.profileSetup)
                        navigate("/chat")
                    else {
                        navigate("/profile")
                    }
                }
                console.log(response)
            }
            catch (e) {
                if (e.response) {
                    if (e.response.status === 400) {
                        toast.error("Please enter both email and password.");
                    } else if (e.response.status === 401) {
                        toast.error("Passowrd Incorrect");
                    }
                    else if (e.response.status === 404) {
                        toast.error("User hasn't signed up yet. Please sign up");
                    }
                } else {
                    toast.error("Network error. Please check your connection."); // Handle network errors
                }
            }
        }
        setDisableButton(false)
    };

    const verifyOtp = async () => {
        setDisableButton(true)
        const toastId = toast.loading("Verifying OTP..."); // Show loading toast

        try {
            const response = await apiClient.post(VERIFY_OTP_ROUTE, { otp, email })

            if (response.status === 200) {
                toast.success("OTP verified! Set password.", { id: toastId });
                setOtpVerified(true)
                ////////////////////////
                setPassword("")
            }
            else {
                toast.error(data.error || "Failed to verify OTP", { id: toastId });
            }
        }
        catch (e) {
            toast.error("Something went wrong!", { id: toastId });
        }
        setDisableButton(false)
    }

    const handleSignup = async () => {
        setDisableButton(true)

        try {
            const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true })

            if (response.status === 201) {
                setUserInfo(response.data.user)
                navigate("/profile")
            }

            console.log({ response })

        }
        catch (e) {
            if (e.response) {
                if (e.response.status === 409) {
                    toast.error("User has already signed up. Try logging in.");
                } else {
                    toast.error("An unexpected error occurred. Please try again."); // General error handling
                }
            } else {
                toast.error("Network error. Please check your connection."); // Handle network errors
            }
        }
        setDisableButton(false)

    };

    return (
        <div className="h-[100vh] w-[100vw] flex items-center justify-center" >
            <div className="h-[80vh]  border-2 bg-white border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2 " >
                <div className="flex flex-col gap-10 items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                        <div className="flex items-center justify-center">
                            <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
                            <img src={Victory} alt="Victory emoji" className="h-[100px]" />
                        </div>
                        <p className="font-medium text-center"> Fill in the details to get started with the best chat app!</p>
                    </div>
                    <div className="flex items-center justify-center w-full">
                        <Tabs className="w-3/4" defaultValue="login">
                            <TabsList className="bg-transparent rounded-none w-full">
                                <TabsTrigger value="login"
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black text-opacity-90 border-b-2 rounded-none w-full">Login</TabsTrigger>
                                <TabsTrigger value="signup"
                                    className="data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 text-black text-opacity-90 border-b-2 rounded-none w-full">Signup</TabsTrigger>
                            </TabsList>
                            <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                                <Input placeholder="Email" type="email" className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                                <Input placeholder="Password" type="password" className="rounded-full p-6"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />

                                <Button className="rounded-full p-6 bg-purple-500" onClick={handleLogin} disabled={disableButton}>Login</Button>
                            </TabsContent>
                            <TabsContent className="flex flex-col gap-5 " value="signup">
                                <Input placeholder="Email" type="email" className="rounded-full p-6"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} disabled={otpSent} />
                                <div className={`${otpSent && !otpVerified ? "block" : "hidden"} mx-auto`}>OTP expires in 3 minutes.</div>
                                <Input placeholder="OTP" type="text" className={`rounded-full p-6 ${otpSent ? "block" : "hidden"} ${otpVerified ? "hidden" : ""}`}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)} />
                                <Input placeholder="Password" type="password" className={`rounded-full p-6 ${otpVerified ? "block" : "hidden"}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                                <Button className={`rounded-full p-6 pb-10 bg-purple-500 ${otpSent ? "hidden" : "block"}`} onClick={sendOtp} disabled={disableButton}>Send OTP</Button>
                                <Button className={`rounded-full p-6 bg-purple-500 ${otpSent ? "block" : "hidden"} `} onClick={() => { otpVerified ? handleSignup() : verifyOtp() }} disabled={disableButton}>{`${otpVerified ? "Signup" : "Verify OTP"}`}</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <div className="hidden xl:flex justify-center items-center ">
                    <img src={Background} alt="background login" className="h-[500px] object-contain" />
                </div>
            </div>
        </div>
    )
};

export default Auth