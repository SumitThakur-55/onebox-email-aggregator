require("dotenv").config();
const express = require("express");
const { UserModel, OAuthCredentialModel } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const emailRouter = express.Router();

emailRouter.post("/store-email-token", async (req, res) => {
    try {
        const { email, accessToken, refreshToken, scope, expiry } = req.body;
        if (!email || !accessToken || !refreshToken || !expiry) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Retrieve the user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userId = user._id;

        // Determine provider based on email domain
        let provider = "other";
        if (email.includes("gmail.com")) provider = "gmail";
        else if (email.includes("outlook.com") || email.includes("hotmail.com")) provider = "outlook";
        else if (email.includes("yahoo.com")) provider = "yahoo";

        // Check if the email already exists in connectedEmails
        const emailExists = user.connectedEmails.some(conn => conn.email === email);

        if (!emailExists) {
            // Only add the email if it does not already exist
            await UserModel.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        connectedEmails: {
                            email,
                            authType: "oauth",
                            provider,
                            lastSync: new Date()
                        }
                    }
                },
                { new: true }
            );
        }

        // Store OAuth credentials
        await OAuthCredentialModel.create({
            userId,
            email,
            accessToken,
            refreshToken,
            scope,
            tokenExpiresAt: new Date(expiry)
        });

        return res.status(201).json({ success: true, message: "OAuth connection successful" });

    } catch (error) {
        console.error("OAuth connection error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

});

module.exports = emailRouter;
