const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No token" });
        }

        const decoded = jwt.verify(token, SECRET);

        req.userId = decoded.userId;
        req.user = decoded;

        next();

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};