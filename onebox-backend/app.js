require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

// Allow frontend to send credentials
app.use(
    cors({
        origin: "http://localhost:3000", // Adjust to your frontend URL
        credentials: true,
    })
);

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

// Use Auth Routes
app.use("/auth", authRouter);

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));