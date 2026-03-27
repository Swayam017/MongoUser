const express = require("express");
const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart
} = require("../controllers/cartController");

const auth = require("../middleware/auth");

router.post("/cart", auth, addToCart);
router.get("/cart", auth, getCart);
router.put("/cart", auth, updateCartItem);
router.delete("/cart", auth, removeFromCart);

module.exports = router;