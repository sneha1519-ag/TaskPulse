import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const session = await getServerSession(authOptions);

        if (session) {
            return NextResponse.json(
                { error: "Already logged in" },
                { status: 400 }
            );
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 401 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "An error occurred during login" },
            { status: 500 }
        );
    }
} 