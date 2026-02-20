import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "text" }
            },
            async authorize(credentials: any): Promise<any> {
                dbConnect()

                try {
                    const user = await userModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })

                    if (!user) {
                        throw new Error("User not Found")
                    }

                    if (!user.isVerified) {
                        throw new Error("User is not Verified! Please Complete the Verification first")
                    }

                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password)

                    if (isCorrectPassword) {
                        return user
                    } else {
                        throw new Error("Password is incorrect. Please Enter the correct Password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                const googleProfile = profile as {
                    email: string,
                    email_verified: boolean
                }

                if (!googleProfile.email_verified) {
                    return false
                }

                await dbConnect()

                const user = await userModel.findOne({ email: googleProfile.email })

                if (!user || !user.isVerified) {
                    return false
                }

                return true

            }

            if (account?.provider === "github") {
                if (!profile?.email) return false

                await dbConnect()

                const dbUser = await userModel.findOne({ email: profile.email })

                if (!dbUser || !dbUser.isVerified) {
                    return false
                }

                return true

            }
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }

            if (account) {
                if (account.provider === "google") {
                    if (!token.email) return token

                    await dbConnect()

                    const dbUser = await userModel.findOne({ email: token.email })

                    if (!dbUser || !dbUser.isVerified) return token

                    token._id = dbUser._id?.toString()
                    token.username = dbUser.username
                    token.isAcceptingMessage = dbUser.isAcceptingMessages
                    token.isVerified = dbUser.isVerified
                }

                if (account.provider === "github") {
                    if (!token.email) return token

                    await dbConnect()

                    const dbUser = await userModel.findOne({ email: token.email })

                    if (!dbUser || !dbUser.isVerified) return token

                    token._id = dbUser._id?.toString()
                    token.username = dbUser.username
                    token.isAcceptingMessage = dbUser.isAcceptingMessages
                    token.isVerified = dbUser.isVerified
                }
            }
            return token
        },
        async session({ session, token, }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}