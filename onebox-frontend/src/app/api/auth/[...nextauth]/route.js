import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    debug: true,
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                // Send Google user data to your backend
                const res = await fetch("http://localhost:5000/auth/google-signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: profile.email,
                        firstName: profile.given_name,
                        lastName: profile.family_name,
                    }),
                });

                if (!res.ok) {
                    return false; // Stop sign-in if backend fails
                }
            }
            return true;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };