import { google } from "googleapis";
import { useSession } from "next-auth/react";
import axios from "axios"
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export async function GET(req) {
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
                    Location: `http://localhost:3000/error?message=Authentication+failed`
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
                    Location: `http://localhost:3000/error?message=Failed+to+get+user+info`
                }
            });
        }

        const payload = {
            email: userData.email,
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            scope: tokens.scope,
            expiry: tokens.expiry_date,
        };

        console.log("Sending payload to backend:", {
            ...payload,
            accessToken: "REDACTED",
            refreshToken: "REDACTED"
        });

        // Send data to backend
        const response = await axios.post(
            "http://localhost:5000/email/store-email-token",
            payload, // Directly pass the payload as the request body
            {
                withCredentials: true, // Equivalent to `credentials: "include"`
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.accessToken}`,
                },
            }
        );


        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to store token:", errorText);
            return new Response(null, {
                status: 307,
                headers: {
                    Location: `http://localhost:3000/error?message=Failed+to+store+token`
                }
            });
        }

        // Fixed redirect with full URL
        return new Response(null, {
            status: 307,
            headers: {
                Location: `http://localhost:3000/email`
            }
        });

    } catch (error) {
        console.error("OAuth Callback Error:", {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });

        return new Response(null, {
            status: 307,
            headers: {
                Location: `http://localhost:3000/error?message=OAuth+failed`
            }
        });
    }
}