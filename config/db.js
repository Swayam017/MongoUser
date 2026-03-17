const { MongoClient } = require("mongodb");

const url = "mongodb+srv://Swayam:<YOUR_PASSWORD>@cluster0.hzinypx.mongodb.net/?appName=Cluster0";
const client = new MongoClient(url);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db(); 
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}

function getDB() {
    return db;
}

module.exports = { connectDB, getDB };