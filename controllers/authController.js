const { getDB } = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey"; // later use env

// REGISTER
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);

        const db = getDB();
        const users = db.collection("users");

        const existing = await users.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await users.insertOne({
            name,
            email,
            password: hashedPassword,
            role: "user",
            cart: [],
            createdAt: new Date()
        });

        res.status(201).json({ message: "User registered" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user._id ,
            role: user.role},
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful",
            token,
            userId: user._id,
            role: user.role  
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};