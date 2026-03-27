const express = require("express");
const router = express.Router();

const { placeOrder } = require("../controllers/orderController");
const { getUserOrders } = require("../controllers/orderController");
const { getAllOrders, updateOrderStatus } = require("../controllers/orderController");

const auth = require("../middleware/auth");
// 🔐 only admin (optional check later)
router.get("/admin/orders", auth, getAllOrders);
router.put("/admin/order", auth, updateOrderStatus);
router.post("/order", auth, placeOrder);
router.get("/orders", auth, getUserOrders);
module.exports = router;