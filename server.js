require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const { connectDB } = require("./config/db");
const userRoutes = require("./Routes/userRoutes");

const app = express();

app.use(bodyParser.json());

// Routes
app.use("/api", userRoutes);
const cartRoutes = require("./Routes/cartRoutes");
app.use("/api/cart", cartRoutes);
// Start server after DB connect
connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});