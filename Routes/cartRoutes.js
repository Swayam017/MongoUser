const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart
} = require("../controllers/cartController");

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);

module.exports = router;