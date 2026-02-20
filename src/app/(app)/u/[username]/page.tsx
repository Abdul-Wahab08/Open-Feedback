import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { notFound } from "next/navigation";
import PublicProfilePage from "./PublicProfilePage"

export default async function Page({ params }: { params: { username: string } }) {
  dbConnect()

  const { username } = await params
  const user = await userModel.findOne({ username: username, isVerified: true }, { username: 1 })

  if (!user) {
    notFound()
  }

  return <PublicProfilePage username={user.username} />
}
