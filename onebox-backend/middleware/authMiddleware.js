const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Extract JWT from cookies

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

        req.user = decoded; // Attach user data to request
        next(); // Proceed to next middleware/route

    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};

module.exports = authMiddleware;