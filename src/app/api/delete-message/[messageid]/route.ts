import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(request: Request, { params }: { params: Promise<{ messageid: string }> }) {
    const { messageid } = await params
    await dbConnect()

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
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

    const user: User = session?.user as User

    try {
        const updatedUser = await userModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageid } } }
        )

        if (updatedUser.modifiedCount === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not Found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message deleted SuccessFully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error Occurs while deleting the message"
            },
            {
                status: 500
            }
        )
    }
}