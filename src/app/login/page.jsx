"use client"
import {signIn, useSession, signOut} from "next-auth/react"

export default function SignIn() {
    const {data} = useSession()
    return(
        <div>
            <div>
                {JSON.stringify(data, null, 2)}
            </div>
            <button
                onClick={() => signIn("google")}>
                Sign In
            </button>
            <button
                onClick={() => signOut()}>
                Log Out
            </button>
        </div>
    )
}
