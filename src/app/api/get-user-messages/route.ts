import { getServerSession } from "next-auth";
import userModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect()

    const sessions = await getServerSession(authOptions)

    if (!sessions || !sessions.user) {
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

    const user = sessions.user
    const userObjId = new mongoose.Types.ObjectId(user._id)

    try {
        const User = await userModel.aggregate([
            { $match: { _id: userObjId } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ])

        if (!User) {
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

        if(User.length === 0){
            return Response.json(
                {
                    success: false,
                    message: "No message sent to the User"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Fetched User's messages Successfully",
                messages: User[0].messages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while getting user's messages"
            },
            {
                status: 500
            }
        )
    }
}