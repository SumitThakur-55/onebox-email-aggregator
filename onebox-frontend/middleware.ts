// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth({
    callbacks: {
        authorized({ req, token }) {
            if (!token) {
                const url = new URL("/signin", req.nextUrl.origin)
                return NextResponse.redirect(url)
            }
            return true
        },
    },
})

export const config = {
    // Define which routes to protect
    matcher: [
        // Protected routes
        "/email/:path*",
        "/dashboard/:path*",
        // Add any other protected routes

        // Exclude auth routes
        "/((?!auth|api|signin|signup|_next/static|_next/image|favicon.ico).*)",
    ],
}