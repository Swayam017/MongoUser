const { getDB } = require("../config/db");
const userModel = require("../models/userModel");

async function createUser(req, res) {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            contact_no:req.body.contact_no,
            address: req.body.address || [],
            isActive: true,
            createdAt: new Date()
        };

        const result = await userModel.insertUser(user);

        res.status(201).json({
            message: "User created",
            userId: result.insertedId
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getUserById(req, res) {
    try {
        const user = await userModel.findUserByID(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
async function getAllUsers(req, res) {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied ❌" });
    }

    const db = getDB();
    const users = await db.collection("users").find().toArray();

    res.json(users);
}
module.exports = {
    createUser,
    getUserById,
    getAllUsers
};