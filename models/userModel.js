const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const COLLECTION = "users";

async function insertUser(userData) {
    const db = getDB();
    const result = await db.collection(COLLECTION).insertOne(userData);
    return result;
}

async function findUserByID(userId) {
    const db = getDB();
    return await db.collection(COLLECTION).findOne({
        _id: new ObjectId(userId)
    });
}

module.exports = {
    insertUser,
    findUserByID
};