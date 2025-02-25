const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const authRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
authRouter.post("/signup", async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = await UserModel.create({ email, password: hashedPassword, firstName, lastName });
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error creating user", error });
    }
});
authRouter.post("/google-signup", async (req, res) => {
    const { email, firstName, lastName } = req.body;

    try {
        // Check if user already exists
        let user = await UserModel.findOne({ email });
        if (!user) {
            user = await UserModel.create({
                email,
                firstName,
                lastName,
                password: null, // No password for Google users
            });
        }

        res.status(200).json({ message: "User authenticated successfully", user });
    } catch (error) {
        res.status(500).json({ error: "Error authenticating Google user" });
    }
});

// Signin Route (Login)
authRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
        expiresIn: "1d",
    });

    res
        .cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Enable in production
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        })
        .json({ message: "Logged in successfully" });
});
authRouter.get("/me", (req, res) => {
    const userId = req.user.id;
    res.json({ message: userId });
});

// Logout Route
authRouter.post("/logout", (req, res) => {
    res.clearCookie("jwt").json({ message: "Logged out successfully" });
});

module.exports = authRouter;