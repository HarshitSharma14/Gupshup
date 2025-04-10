import "dotenv/config";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken"
import { compare } from "bcrypt";
import { renameSync, unlinkSync } from "fs"
import { deleteProfileImageByUrl, uploadProfileImage } from "../utils/features.js";
import nodemailer from "nodemailer"
import { redis } from "../index.js";
import crypto from "crypto"
import { request } from "http";


const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge })
}



export const signupOtp = async (request, response, next) => {
    try {
        const { email } = request.body;
        if (!email) {
            return response.status(400).send("Please enter email ID");
        }
        const user1 = await User.findOne({ email })
        if (user1) {
            return response.status(409).send("User has already signed up. Try logging in.")
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        await redis.set(`otp:${email}`, otp, "EX", 300); // Store OTP for 5 min

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4A90E2;">Welcome to गपशप!</h2>
                    <p style="font-size: 16px; color: #333;">Hi there,</p>
                    <p style="font-size: 16px; color: #333;">Your OTP code is:</p>
                    <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #4A90E2; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="font-size: 14px; color: #666;">This code will expire in 5 minutes. Please don't share it with anyone.</p>
                    <hr style="margin: 20px 0;">
                    <p style="font-size: 12px; color: #aaa;">If you didn't request this OTP, you can ignore this email.</p>
                </div>
            `
        };


        await transporter.sendMail(mailOptions);
        return response.status(200).json({ message: "OTP sent" });


    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}

export const signup = async (request, response, next) => {
    try {
        const { email, password } = request.body

        const user = await User.create({ email, password })
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        });
        return response.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            }
        })
    }
    catch (e) {
        console.log(e)
    }
}

export const signupVerify = async (request, response, next) => {
    try {
        console.log('init')
        const { otp, email } = request.body
        if (!otp || !email) {
            return response.status(400).send("Please send email, password and OTP.")
        }
        const storedOtp = await redis.get(`otp:${email}`);
        if (!storedOtp) return response.status(400).json({ error: "OTP expired or invalid" });
        if (storedOtp !== otp) return response.status(400).json({ error: "Incorrect OTP" });

        await redis.del(`otp:${email}`); // Remove OTP after verification
        return response.status(200).json({ message: "OTP verified successfully" });
    }
    catch (e) {
        console.log(e)
    }
}

export const login = async (request, response, next) => {
    try {
        const { email, password } = request.body;
        if (!email || !password) {
            return response.status(400).send("Please enter both email and password");
        }
        const user = await User.findOne({ email })
        if (!user) {
            return response.status(404).send("User with the given email not found.")
        }

        const auth = await compare(password, user.password)
        if (!auth) {
            return response.status(401).send("Password is incorrect.")
        }


        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
            httpOnly: true
        });
        return response.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.color
            }
        })

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}

export const getUserInfo = async (request, response, next) => {
    try {
        const userData = await User.findById(request.userId)
        if (!userData) {
            return response.status(404).send("User with the given id not found.")
        }

        return response.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color

        })

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}

export const updateProfile = async (request, response, next) => {
    try {
        const { userId } = request
        const { firstName, lastName, color } = request.body
        if (!firstName || !lastName) {
            return response.status(400).send("FirstName , LastName and Color is required.")
        }

        const userData = await User.findByIdAndUpdate(
            userId, {
            firstName,
            lastName,
            color,
            profileSetup: true,
        },
            { new: true, runValidators: true }
        )



        return response.status(200).json({

            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color

        })

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}


export const addProfileImage = async (request, response, next) => {
    try {
        if (!request.file) {
            return response.status(400).send("Please upload a file.")
        }

        const profileImage = await uploadProfileImage(request)

        // const date = Date.now()
        // let fileName = "uploads/profiles/" + date + "_" + request.file.originalname
        // renameSync(request.file.path, fileName)
        const updatedUser = await User.findByIdAndUpdate(
            request.userId,
            { image: profileImage },
            { new: true, runValidators: true })

        return response.status(200).json({
            image: updatedUser.image,

        })

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}

export const removeProfileImage = async (request, response, next) => {
    try {
        const { userId } = request
        const user = await User.findById(userId)

        if (!user) {
            return response.status(404).send("User not found")
        }

        if (user.image) {
            deleteProfileImageByUrl(user.image)
        }

        user.image = null
        await user.save()
        return response.status(200).send("Profile image removed")

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}

export const logout = async (request, response, next) => {
    try {
        response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" })
        return response.status(200).send("Logout successful")

    } catch (error) {
        console.log(error);
        return response.status(500).send("Internal Server Error")
    }
}