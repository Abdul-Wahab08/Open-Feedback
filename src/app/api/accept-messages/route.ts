import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = session.user._id
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "User's message acceptance updation Failed"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User's message acceptance updated Successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while accepting messages "
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(request: Request) {
    dbConnect()

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = session.user._id
    try {
        const user = await userModel.findById(userId)

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

        return Response.json(
            {
                success: true,
                isAcceptingMessages: user.isAcceptingMessages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while getting user's messages acceptance status"
            },
            {
                status: 500
            }
        )
    }
}