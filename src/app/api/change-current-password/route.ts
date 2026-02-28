import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import bcrypt from "bcrypt"

export async function PATCH(req: Request) {
    await dbConnect()

    try {
        const { oldPassword, newPassword } = await req.json()

        if (!(oldPassword && newPassword)) {
            return Response.json(
                {
                    success: false,
                    message: "Both old password and new password are required"
                },
                {
                    status: 404
                }
            )
        }

        const sessions = await getServerSession(authOptions)

        if (!sessions?.user._id) {
            return Response.json(
                {
                    success: false,
                    message: "Not Authenticated"
                },
                {
                    status: 403
                }
            )
        }

        const user = await userModel.findById(sessions.user._id)

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

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password)

        if (!isPasswordCorrect) {
            return Response.json(
                {
                    success: false,
                    message: "Your entered old Password must be equal to current Password"
                },
                {
                    status: 400
                }
            )
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10)

        const updatedUser = await userModel.findByIdAndUpdate(sessions.user._id,
            { password: hashedNewPassword },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Password updation fails"
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Password updated Successfully"
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while updating the password"
            },
            {
                status: 500
            }
        )
    }
} 