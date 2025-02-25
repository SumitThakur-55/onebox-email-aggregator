import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Export middleware with correct configuration
export default withAuth(
    function middleware(req) {
        const token = req.cookies.get("next-auth.session-token");

        // If no session token exists, redirect to signin
        if (!token) {
            const signInUrl = new URL("/signin", req.url);
            return NextResponse.redirect(signInUrl);
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                return !!token;
            },
        },
        pages: {
            signIn: "/signin",
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - signin (login)
         * - signup (registration)
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!signin|signup|api|_next/static|_next/image|favicon.ico|public).*)",
    ],
}; 