import { auth } from "@/auth";
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, ADMIN_LOGIN_REDIRECT, PROFESSIONAL_USER_REDIRECT } from "@/routes";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const isAdmin = req.auth?.user?.role === 'admin';
    const isProfessionalUser = req.auth?.user?.role === 'professional';
    const isRegularUser = req.auth?.user?.role === 'user';

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) {
        return null;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            if (isAdmin) {
                return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
            } else if (isProfessionalUser) {
                return Response.redirect(new URL(PROFESSIONAL_USER_REDIRECT, nextUrl));
            } else if (isRegularUser) {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl));
    }

    // Login page is already public, remove special handling to prevent loop
    // if (nextUrl.pathname === "/login") {
    //     if (isLoggedIn) {
    //         if (isAdmin) {
    //             return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
    //         } else if (isProfessionalUser) {
    //             return Response.redirect(new URL(PROFESSIONAL_USER_REDIRECT, nextUrl));
    //         } else if (isRegularUser) {
    //             return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    //         }
    //     }
    // }

    // Handle admin routes
    if (nextUrl.pathname.startsWith("/admin")) {
        if (!isAdmin) {
            if (isProfessionalUser) {
                return Response.redirect(new URL(PROFESSIONAL_USER_REDIRECT, nextUrl));
            } else {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
        }
    }

    // Handle professional user routes
    if (nextUrl.pathname.startsWith("/dashboard")) {
        if (!isLoggedIn) {
            return Response.redirect(new URL("/login", nextUrl));
        }
        if (!isProfessionalUser) {
            if (isAdmin) {
                return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
            } else {
                return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
            }
        }
    }

    // Handle regular user routes
    if (nextUrl.pathname.startsWith("/user")) {
        if (!isLoggedIn) {
            return Response.redirect(new URL("/login", nextUrl));
        }
        if (!isRegularUser) {
            if (isAdmin) {
                return Response.redirect(new URL(ADMIN_LOGIN_REDIRECT, nextUrl));
            } else {
                return Response.redirect(new URL(PROFESSIONAL_USER_REDIRECT, nextUrl));
            }
        }
    }

    return null;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};