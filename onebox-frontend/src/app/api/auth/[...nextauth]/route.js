import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const res = await fetch("http://localhost:5000/auth/signin", {
                        method: 'POST',
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" }
                    });
                    const user = await res.json();

                    if (res.ok && user) {
                        return user;
                    }
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        }),
    ],
    pages: {
        signIn: '/signin',
        signUp: '/signup',
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                try {
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
                        throw new Error("Failed to register Google user");
                    }
                } catch (error) {
                    console.error("Google signup error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };