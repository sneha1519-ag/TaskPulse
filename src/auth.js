import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {dbConnect} from "@/db/db-connect.js";
import { User } from "@/db/models/index.js";

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async signIn({ user, account }) {
            try {
                await dbConnect();

                // Check if user exists
                const existingUser = await User.findOne({
                    email: user.email
                });

                // Create new user if they don't exist
                if (!existingUser) {
                    const newUser = await User.create({
                        email: user.email,
                        firstName: user.name?.split(' ')[0] || '',
                        lastName: user.name?.split(' ').slice(1).join(' ') || '',
                        profileImage: user.image || '',
                        password: Math.random().toString(36).slice(-8),
                        role: 'user', // Default role for new users
                    });
                    user.role = newUser.role;
                } else {
                    // Update last login time for existing users
                    existingUser.lastLogin = new Date();
                    await existingUser.save();
                    user.role = existingUser.role;
                }

                return true;
            } catch (error) {
                console.error("Authentication error:", error);
                return false;
            }
        },
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at * 1000,
                    role: user.role,
                    email: user.email,
                };
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpires) {
                return token;
            }

            // Only attempt to refresh if we have a refresh token and it's a Google account
            if (token.refreshToken && token.provider === 'google') {
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
                        console.error("Error refreshing token:", refreshedTokens);
                        return { ...token, error: "RefreshAccessTokenError" };
                    }

                    return {
                        ...token,
                        accessToken: refreshedTokens.access_token,
                        accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
                        refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
                    };
                } catch (error) {
                    console.error("Error refreshing access token", error);
                    return { ...token, error: "RefreshAccessTokenError" };
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.email = token.email;
            }
            return session;
        },
    },
    ...authConfig,
});
