require("dotenv").config();
const express = require("express");
const path = require("path");

const { connectDB } = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const authRoutes = require("./Routes/authRoutes");
const orderRoutes = require("./Routes/orderRoutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads")); 

// Routes
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
// Start server after DB connect
connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
});