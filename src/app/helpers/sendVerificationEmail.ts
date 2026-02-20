import { Resend } from "resend";
import verificationEmail from "../../../emails/verification";
import { apiResponse } from "@/types/apiResponse";

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerficationEmail = async (email: string, username: string, verifyCode: string): Promise<apiResponse> => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | verification code',
            react: verificationEmail({ username: username, otp: verifyCode })
        })

        return {success: true, message: "Verification email sent Successfully"}
        } catch (error) {
            console.log("Error while sending verification email ", error)
            return { success: false, message: "Failed to send verification email" }
        }
    }