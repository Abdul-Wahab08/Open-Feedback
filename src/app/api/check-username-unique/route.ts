import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import * as z from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameValidationQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(req: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(req.url)

        const queryParams = {
            username: searchParams.get("username")
        }

        const result = usernameValidationQuerySchema.safeParse(queryParams)

        if (!result.success) {
            const usernameValidationError = result.error.format().username?._errors || []
            return Response.json(
                {
                    success: false,
                    message: usernameValidationError.length > 0 ? usernameValidationError.join(", ") : "Invalid Query Parameters"
                },
                {
                    status: 400
                }
            )
        }

        const username = result.data.username

        const user = await userModel.findOne({
            username,
            isVerified: true
        })

        if (user) {
            return Response.json(
                {
                    success: false,
                    message: "Username already exists. Please try different username"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User is Unique"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while checking username is unique"
            },
            {
                status: 500
            }
        )
    }
}