import { sendVerficationEmail } from "@/app/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username } = await request.json()

        const user = await userModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: true,
                    message: "If an account exists, a new code has been sent."
                },
                {
                    status: 200
                }
            )
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User is already verified"
                },
                {
                    status: 409
                }
            )
        }

        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString()
        const newExpiryDate = new Date()
        newExpiryDate.setHours(newExpiryDate.getHours() + 1)

        user.verifyCode = newVerificationCode
        user.verifyCodeExpiry = newExpiryDate
        await user.save()

        const sendVerficationEmailResponse = await sendVerficationEmail(user.email, user.username, newVerificationCode)

        if (!sendVerficationEmailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: sendVerficationEmailResponse.message || "Error occurs while sending verification code to your email"
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "New Verification Code sent to your email"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error Occurs while resending verification code", error)
        return Response.json(
            {
                success: false,
                message: "Error Occurs while resending verification code"
            },
            {
                status: 500
            }
        )
    }
}