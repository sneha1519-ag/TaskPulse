import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { dbConnect } from "@/db/db-connect";
import { User } from "@/db/models";
import bcrypt from 'bcryptjs';

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: "openid email profile https://www.googleapis.com/auth/calendar",
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                role: { label: "Role", type: "text", required: false }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                try {
                    await dbConnect();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("User not found");
                    }

                    // Use the comparePassword method
                    const isValid = await user.comparePassword(credentials.password);

                    if (!isValid) {
                        throw new Error("Invalid password");
                    }

                    // Only check role if it's provided
                    if (credentials.role && user.role !== credentials.role) {
                        throw new Error(`Access denied. ${credentials.role} privileges required.`);
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        role: user.role,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    throw new Error(error.message || "Authentication failed");
                }
            }
        })
    ],
};