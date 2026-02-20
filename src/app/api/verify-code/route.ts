import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import * as z from "zod"
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";

const verificationCodeSchema = z.object({
    verifyCode: verifyCodeSchema
})

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await userModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        if (user.isVerified) {
            return Response.json(
                {
                    success: false,
                    message: "User is Already Verified"
                },
                {
                    status: 409
                }
            )
        }

        const result = verificationCodeSchema.safeParse({ verifyCode: { code: code } })
        console.log("Result of safeparsing verify code in our zod schema: ", result)

        if (!result.success) {
            const verifyCodeErrors = z.treeifyError(result.error)
            console.log("VerifyCodeErrors", verifyCodeErrors)
            const verifyCodeErrorsTreeifyError = verifyCodeErrors.properties?.verifyCode?.properties?.code?.errors || []
            return Response.json(
                {
                    success: false,
                    message: verifyCodeErrorsTreeifyError.length < 1 ? verifyCodeErrors : "Invalid Query Parameters"
                },
                {
                    status: 400
                }
            )
        }

        const validCode = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (validCode && isCodeNotExpired) {
            user.isVerified = true
            await user.save()

            return Response.json(
                {
                    success: true,
                    message: "User's code verified SuccessFully"
                },
                {
                    status: 200
                }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Your verification code is Expired"
                },
                {
                    status: 400
                }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalid Verification code"
                },
                {
                    status: 400
                }
            )
        }

    } catch (error) {
        console.log("Error occurs while verifying code ", error)
        return Response.json(
            {
                success: false,
                message: "Error occurs while verifying code"
            },
            {
                status: 500
            }
        )
    }
}