const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION = "users";

async function insertUser(userData) {
    const db = getDB();
    return await db.collection(COLLECTION).insertOne(userData);
}

async function getAllUsers() {
    const db = getDB();
    return await db.collection(COLLECTION).find().toArray();
}

async function findUserByID(id) {
    const db = getDB();
    return await db.collection(COLLECTION).findOne({
        _id: new ObjectId(id)
    });
}

async function deleteUser(id) {
    const db = getDB();
    return await db.collection(COLLECTION).deleteOne({
        _id: new ObjectId(id)
    });
}

module.exports = {
    insertUser,
    getAllUsers,
    findUserByID,
    deleteUser
};