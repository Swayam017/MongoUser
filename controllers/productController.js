const { getDB } = require("../config/db");

// ================= GET ALL PRODUCTS =================
exports.getProducts = (req, res) => {
    const db = getDB();

    db.collection('products')
        .find()
        .toArray()
        .then(products => {
            res.status(200).json(products);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error fetching products" });
        });
};


// ================= ADD PRODUCT =================
exports.addProduct = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied ❌" });
    }

    const db = getDB();

    const product = {
        title: req.body.title,
        price: Number(req.body.price),
        description: req.body.description,
        imageUrl: req.file ? "/uploads/" + req.file.filename : null,
        createdAt: new Date()
    };

    db.collection("products")
        .insertOne(product)
        .then(() => {
            res.status(201).json({ message: "Product added ✅" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error adding product" });
        });
};


// ================= GET SINGLE PRODUCT =================
exports.getProductById = (req, res) => {
    const db = getDB();
    const { ObjectId } = require("mongodb");

    const id = req.params.id;

    db.collection('products')
        .findOne({ _id: new ObjectId(id) })
        .then(product => {
            res.status(200).json(product);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error fetching product" });
        });
};


// ================= DELETE PRODUCT =================
exports.deleteProduct = (req, res) => {
        if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied ❌" });
    }
    const db = getDB();
    const { ObjectId } = require("mongodb");

    const id = req.params.id;

    db.collection('products')
        .deleteOne({ _id: new ObjectId(id) })
        .then(result => {
            res.status(200).json({ message: "Product deleted" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error deleting product" });
        });
};


// ================= UPDATE PRODUCT =================
exports.updateProduct = (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied ❌" });
    }

    const db = getDB();
    const { ObjectId } = require("mongodb");

    const id = req.params.id;

    const updateData = {
        title: req.body.title,
        price: Number(req.body.price),
        description: req.body.description
    };

    // 🔥 if new image uploaded
    if (req.file) {
        updateData.imageUrl = "/uploads/" + req.file.filename;
    }

    db.collection("products")
        .updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )
        .then(() => {
            res.status(200).json({ message: "Updated ✅" });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "Error updating" });
        });
};