import authConfig from "@/auth.config";
import NextAuth from "next-auth";

export const { auth, handlers, signIn, signOut } = NextAuth({
    callbacks: {
        async jwt({ token, account, user }) {
            // Initial sign in
            if (account && user) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    accessTokenExpires: account.expires_at * 1000,
                    user,
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
            // Make tokens available in the client session
            session.accessToken = token.accessToken;
            session.refreshToken = token.refreshToken;
            session.expiresAt = token.expiresAt;
            return session;
        },
    },
    ...authConfig,
});
