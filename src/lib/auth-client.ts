import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    //you can pass client configuration here
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "")
})

export const { useSession, signIn, signUp, signOut } = authClient;
