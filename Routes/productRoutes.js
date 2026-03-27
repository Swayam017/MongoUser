const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload"); //  ADD

router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);

//  add multer here
router.post("/products", auth, upload.single("image"), productController.addProduct);

router.delete("/products/:id", auth, productController.deleteProduct);
router.put("/products/:id", auth, upload.single("image"), productController.updateProduct);

module.exports = router;