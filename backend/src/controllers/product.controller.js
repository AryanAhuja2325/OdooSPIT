const Product = require("../models/product.model");
const Stock = require("../models/stock.model"); // 👈 import Stock

async function createProduct(req, res) {
    try {
        const { name, sku, category, uom, reorderLevel } = req.body;

        const existing = await Product.findOne({ sku });
        if (existing) return res.status(400).json({ error: "SKU already exists" });

        const product = await Product.create({ name, sku, category, uom, reorderLevel });
        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProducts(req, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        const updatedProducts = await Promise.all(
            products.map(async (product) => {
                // Get total stock for this product
                const stockData = await Stock.aggregate([
                    { $match: { product: product._id } },
                    { $group: { _id: null, totalStock: { $sum: "$quantity" } } },
                ]);

                return {
                    ...product._doc,
                    totalStock: stockData.length ? stockData[0].totalStock : 0,
                };
            })
        );

        res.status(200).json(updatedProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function getProduct(req, res) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: "Product not found" });

        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProduct(req, res) {
    try {
        const { name, category, uom, reorderLevel } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, category, uom, reorderLevel },
            { new: true }
        );

        if (!product) return res.status(404).json({ error: "Product not found" });

        res.status(200).json({ message: "Product updated", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteProduct(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
};
