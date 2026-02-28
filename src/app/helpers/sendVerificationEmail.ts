import { Resend } from "resend";
import verificationEmail from "../../../emails/verification";
import { apiResponse } from "@/types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY)
const baseUrl = process.env.NEXTAUTH_URL || ""

export const sendVerficationEmail = async (email: string, username: string, verifyCode: string): Promise<apiResponse> => {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Open Feedback | Verification Code',
            react: verificationEmail({ username: username, otp: verifyCode, baseUrl: baseUrl })
        })

        if (response.error) {
            return { success: false, message: response.error.message }
        }

        return { success: true, message: "Verification email sent Successfully" }
    } catch (error) {
        console.log("Error while sending verification email ", error)
        return { success: false, message: "Failed to send verification email" }
    }
}