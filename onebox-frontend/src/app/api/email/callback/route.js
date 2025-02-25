import { google } from "googleapis";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET(req) {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(null, {
            status: 307,
            headers: {
                Location: `/signin?error=Please sign in first`
            }
        });
    }

    const searchParams = new URL(req.url).searchParams;
    const code = searchParams.get('code');

    if (!code) {
        return new Response(JSON.stringify({ error: "Missing authorization code" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Get tokens with error handling
        let tokens;
        try {
            const tokenResponse = await oauth2Client.getToken(code);
            tokens = tokenResponse.tokens;
        } catch (tokenError) {
            console.error("Token Error:", tokenError);
            return new Response(null, {
                status: 307,
                headers: {
                    Location: `/error?message=Authentication+failed`
                }
            });
        }

        oauth2Client.setCredentials(tokens);

        // Get user info with error handling
        let userData;
        try {
            const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
            const { data } = await oauth2.userinfo.get();
            userData = data;
        } catch (userInfoError) {
            console.error("UserInfo Error:", userInfoError);
            return new Response(null, {
                status: 307,
                headers: {
                    Location: `/error?message=Failed+to+get+user+info`
                }
            });
        }

        const payload = {
            userId: session.user.id, // Add user ID from session
            email: userData.email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            scope: tokens.scope,
            expiry: tokens.expiry_date,
        };

        console.log("Sending payload to backend:", {
            ...payload,
            userId: session.user.id,
            accessToken: "REDACTED",
            refreshToken: "REDACTED"
        });

        // Send data to backend with authorization header
        const response = await fetch("http://localhost:5000/email/store-email-token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.id}` // Add authorization header
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to store token:", errorData);
            return new Response(null, {
                status: 307,
                headers: {
                    Location: `/error?message=${encodeURIComponent(errorData.message || 'Failed to store token')}`
                }
            });
        }

        return new Response(null, {
            status: 307,
            headers: {
                Location: `/dashboard?success=Email+connected+successfully`
            }
        });

    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return new Response(null, {
            status: 307,
            headers: {
                Location: `/error?message=${encodeURIComponent(error.message || 'OAuth failed')}`
            }
        });
    }
}