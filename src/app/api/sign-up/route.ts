import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import bcrypt from "bcrypt"
import { sendVerficationEmail } from "@/app/helpers/sendVerificationEmail";

export async function POST(request: Request) {
     dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingEmailVerifiedUser = await userModel.findOne({
            email: email,
            isVerified: true
        })

        if (existingEmailVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    mesaage: "This email is already registered"
                },
                {
                    status: 400
                }
            )
        }

        const existingUsernameVerifiedUser = await userModel.findOne({
            username,
            isVerified: true
        })

        if (existingUsernameVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: "A user with this email already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingEmailUser = await userModel.findOne({ email })
        const verificationCode = Math.floor((100000 * Math.random()) + 100000).toString()

        if (existingEmailUser?.isVerified === false) {

            const hashedPassword = await bcrypt.hash(password, 10)
            existingEmailUser.password = hashedPassword
            existingEmailUser.verifyCode = verificationCode
            existingEmailUser.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingEmailUser.save()

        } else if (!existingEmailUser) {

            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new userModel({
                email,
                username,
                password: hashedPassword,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()
        }
    
        const emailVerificationResponse = await sendVerficationEmail(email, username, verificationCode)
        console.log("Email Verification Response", emailVerificationResponse)

        if (!emailVerificationResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailVerificationResponse.message
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User registered SuccessFully"
            },
            {
                status: 201
            }
        )

    } catch (error) {
        console.log("Error occurs while registering the user", error)
        return Response.json(
            {
                success: false,
                message: "Error occurs while registering the user"
            },
            {
                status: 500
            }
        )
    }
}