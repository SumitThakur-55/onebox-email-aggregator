import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET(req) {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/userinfo.email",
            "openid",
            "email"
        ],
        prompt: "consent",
        state: session.user.id, // Add user ID to state for additional security
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    });

    return new Response(JSON.stringify({ url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
