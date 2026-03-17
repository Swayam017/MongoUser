const userModel = require("../models/userModel");

async function createUser(req, res) {
    try {
        const user = {
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            hobbies: req.body.hobbies || [],
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

module.exports = {
    createUser,
    getUserById
};