import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get("username")

        if (!username) {
            return Response.json(
                {
                    success: false,
                    message: "Username is required",
                },
                {
                    status: 400
                }
            )
        }

        const users = await userModel.find({
            username: { $regex: username, $options: "i" },
            isVerified: true
        })

        if (!users || users.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                    users: []
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Users fetched successfully",
                users: users.map((user) => user.username)
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error occurs while finding users"
            },
            {
                status: 500
            }
        )
    }
}