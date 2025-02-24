const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }, // For users who sign in with password (optional)
    firstName: String,
    lastName: String,
    connectedEmails: [
        {
            email: { type: String, required: true },
            authType: { type: String, enum: ["oauth", "smtp"], required: true },
            provider: { type: String, enum: ["gmail", "outlook", "yahoo"] },
            lastSync: { type: Date, default: null } // Last time emails were fetched
        }
    ],
}, { timestamps: true });
const OAuthCredentialSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    email: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    scope: { type: String, default: "https://mail.google.com/" },
    tokenExpiresAt: { type: Date, required: true }
}, { timestamps: true });
const UserModel = mongoose.model("User", UserSchema);
const OAuthCredentialModel = mongoose.model("OAuthCredential", OAuthCredentialSchema);
module.exports = {
    UserModel: UserModel,
    OAuthCredentialModel: OAuthCredentialModel
};
