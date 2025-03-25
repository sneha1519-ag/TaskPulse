import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
    authRoutes,
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isPublicRoute = publicRoutes.some(route => {
        if (route.includes("(.*)")) {
            const baseRoute = route.replace("(.*)", "");
            return nextUrl.pathname.startsWith(baseRoute);
        }
        return nextUrl.pathname === route;
    });

    if (isApiAuthRoute) {
        return null;
    }
    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }
    if (!isPublicRoute && !isLoggedIn) {
        return Response.redirect(new URL("/login", nextUrl));
    }
    return null;
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};