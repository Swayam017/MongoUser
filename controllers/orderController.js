const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.userId;

        const db = getDB();
        const users = db.collection("users");
        const products = db.collection("products");
        const orders = db.collection("orders");

        const user = await users.findOne({ _id: new ObjectId(userId) });

        const cart = user.cart || [];

        if (cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        let total = 0;

        const orderItems = await Promise.all(
            cart.map(async (item) => {
                const product = await products.findOne({
                    _id: item.productId
                });

                total += product.price * item.quantity;

                return {
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    quantity: item.quantity
                };
            })
        );

        const order = {
            userId: new ObjectId(userId),
            items: orderItems,
            total,
            status: "Placed",
            createdAt: new Date()
        };

        await orders.insertOne(order);

        // 🧹 clear cart
        await users.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { cart: [] } }
        );

        res.json({ message: "Order placed successfully", order });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const db = getDB();
        const orders = db.collection("orders");

        const userOrders = await orders
            .find({ userId: new ObjectId(userId) })
            .sort({ createdAt: -1 })
            .toArray();

        res.json(userOrders);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const db = getDB();
        const orders = db.collection("orders");

        const allOrders = await orders
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        res.json(allOrders);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const db = getDB();
        const orders = db.collection("orders");

        await orders.updateOne(
            { _id: new ObjectId(orderId) },
            { $set: { status } }
        );

        res.json({ message: "Status updated" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};