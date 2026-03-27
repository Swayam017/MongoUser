const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// ✅ ADD TO CART
exports.addToCart = async (req, res) => {
    try {
        const userId = req.userId; // 🔥 from JWT
        const { productId } = req.body;

        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({ _id: new ObjectId(userId) });

        let cart = user.cart || [];

        const index = cart.findIndex(
            item => item.productId.toString() === productId
        );

        if (index > -1) {
            cart[index].quantity += 1;
        } else {
            cart.push({
                productId: new ObjectId(productId),
                quantity: 1
            });
        }

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { cart } }
        );

        res.json(cart);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ GET CART (POPULATED)
exports.getCart = async (req, res) => {
    try {
        const userId = req.userId;

        const db = getDB();
        const users = db.collection("users");
        const products = db.collection("products");

        const user = await users.findOne({
            _id: new ObjectId(userId)
        });

        const cart = user.cart || [];

        const populatedCart = await Promise.all(
            cart.map(async (item) => {
                const product = await products.findOne({
                    _id: item.productId
                });

                return {
                    product,
                    quantity: item.quantity
                };
            })
        );

        res.json(populatedCart);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ UPDATE CART
exports.updateCartItem = async (req, res) => {
    try {
        const userId = req.userId;
const { productId, quantity } = req.body;

        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({
            _id: new ObjectId(userId)
        });

        let cart = user.cart || [];

        cart = cart.map(item => {
            if (item.productId.toString() === productId) {
                return { ...item, quantity: Number(quantity) };
            }
            return item;
        });

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { cart } }
        );

        res.json({ message: "Cart updated", cart });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// ✅ REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
const { productId } = req.body;

        const db = getDB();
        const users = db.collection("users");

        const user = await users.findOne({
            _id: new ObjectId(userId)
        });

        const cart = (user.cart || []).filter(
            item => item.productId.toString() !== productId
        );

        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { cart } }
        );

        res.json({ message: "Item removed", cart });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};