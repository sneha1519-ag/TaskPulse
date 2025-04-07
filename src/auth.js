import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {dbConnect} from "@/db/db-connect.js";
import { User } from "@/db/models/index.js";

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async signIn({ user }) {
            try {
                await dbConnect();

                // Check if user exists
                const existingUser = await User.findOne({
                    email: user.email
                });

                // Create new user if they don't exist
                if (!existingUser) {
                    await User.create({
                        email: user.email,
                        firstName: user.name?.split(' ')[0] || '', // Split name into first and last name
                        lastName: user.name?.split(' ').slice(1).join(' ') || '',
                        profileImage: user.image || '',
                        password: Math.random().toString(36).slice(-8),
                        role: 'admin', // Default role
                    });
                } else {
                    // Update last login time for existing users
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                }

                return true;
            } catch (error) {
                console.error("Authentication error:", error);
                return false;
            }
        },
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account && user) {
                // Fetch the user from database to get the role
                await dbConnect();
                const dbUser = await User.findOne({ email: user.email });
                
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at * 1000,
                    user: {
                        ...user,
                        role: dbUser?.role || 'user'
                    },
                };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Access token has expired, try to refresh it
            try {
                const response = await fetch("https://oauth2.googleapis.com/token", {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: token.refreshToken,
                    }),
                    method: "POST",
                });

                const refreshedTokens = await response.json();

                if (!response.ok) {
                    throw refreshedTokens;
                }

                return {
                    ...token,
                    accessToken: refreshedTokens.access_token,
                    accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
                };
            } catch (error) {
                console.error("Error refreshing access token", error);
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },
        async session({ session, token }) {
            // Make tokens and user role available in the client session
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;
            session.user.role = token.user?.role || 'user';
            return session;
        },
    },
    ...authConfig,
});
