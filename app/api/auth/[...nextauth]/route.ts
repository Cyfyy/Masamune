import { connect } from "@/utils/config/dbConfig"
import { User } from "next-auth"
import UserDB from "@/utils/models/auth"
import NextAuth, { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcryptjs from "bcryptjs"

declare module "next-auth" {
  interface User {
    roninAddress?: string
  }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }
                try {
                    await connect();
                    const user = await UserDB.findOne({ email })
                    if (!user) {
                        console.log(`User not found for email: ${email}`);
                        return null
                    }

                    const passwordMatch = await bcryptjs.compare(password, user.password)
                    if (!passwordMatch) {
                        console.log(`Invalid password for email: ${email}`);
                        return null
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                    }
                } catch (error) {
                    console.error("Error logging in:", error);
                    return null
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            id: "ronin-wallet",
            name: "Ronin Wallet",
            credentials: {
                address: { label: "Ronin Address", type: "text" }
            },
            async authorize(credentials) {
                const { address } = credentials as { address: string }
                try {
                    await connect();
                    let user = await UserDB.findOne({ roninAddress: address })
                    if (!user) {
                        // Create a new user if they don't exist
                        user = await new UserDB({
                            roninAddress: address,
                            name: `Ronin User ${address.slice(0, 6)}`,
                            email: `${address.toLowerCase()}@ronin.placeholder`,
                        }).save();
                    }
                    return {
                        id: user._id.toString(),
                        roninAddress: user.roninAddress,
                        name: user.name,
                        email: user.email,
                    }
                } catch (error: any) {
                    if (error.code === 11000 && error.keyPattern.email) {
                        // If the error is due to a duplicate email, try to find and return the existing user
                        const existingUser = await UserDB.findOne({ email: `${address.toLowerCase()}@ronin.placeholder` });
                        if (existingUser) {
                            return {
                                id: existingUser._id.toString(),
                                roninAddress: existingUser.roninAddress,
                                name: existingUser.name,
                                email: existingUser.email,
                            };
                        }
                    }
                    console.error("Error logging in with Ronin Wallet:", error);
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }: { token: JWT, user: User & { id?: string, roninAddress?: string }, account: any }) {
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                if (user.roninAddress) {
                    token.roninAddress = user.roninAddress
                }
            }
            if (account && account.provider === "google") {
                token.googleId = account.providerAccountId
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                if (token.roninAddress) {
                    (session.user as User & { roninAddress?: string }).roninAddress = token.roninAddress as string
                }
            }
            return session
        },
    },
    pages: {
        signIn: "/auth/signin",
        signOut: "/auth/signout",
        error: "/auth/error",
    },
    debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

