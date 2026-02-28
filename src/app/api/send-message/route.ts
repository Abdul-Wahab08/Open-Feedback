import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, content } = await request.json()

        if (!(username && content)) {
            return Response.json(
                {
                    success: false,
                    message: "Both username and content are required"
                },
                {
                    status: 400
                }
            )
        }

        const user = await userModel.findOne({
            username: username
        })

        const sessions = await getServerSession(authOptions)

        if (sessions?.user && sessions.user.username === user?.username) {
            return Response.json(
                {
                    success: false,
                    message: "You cannot send message to your own account!"
                },
                {
                    status: 400
                }
            )
        }

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
        } else if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                },
                {
                    status: 403
                }
            )
        }

        const blockedWords = ["fuck", "murder", "hate", "destroy"]

        const isBlockedWordsPresent = (message: string): boolean => {
            const lowerCaseMessage = message.toLowerCase()
            return blockedWords.some((mess) => lowerCaseMessage.includes(mess))
        }

        if (isBlockedWordsPresent(content)) {
            return Response.json(
                {
                    success: false,
                    message: "Message blocked due to unsafe content"
                },
                {
                    status: 400
                }
            )
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: true,
                message: "Message is being sent Successfully",
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while sending the message"
            },
            {
                status: 500
            }
        )
    }
}