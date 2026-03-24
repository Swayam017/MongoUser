const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.MONGO_URL);

let db;

async function connectDB() {
    try {
        await client.connect();
         // Ping test
        await client.db("admin").command({ ping: 1 });
        db = client.db("myDb");
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}

function getDB() {
    if (!db) throw new Error("DB not initialized");
    return db;
}

module.exports = { connectDB, getDB };