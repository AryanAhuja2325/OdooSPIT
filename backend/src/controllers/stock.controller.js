const Stock = require("../models/stock.model");
const Product = require("../models/product.model");
const Warehouse = require("../models/warehouse.model");
const StockLog = require("../models/stocklog.model");

async function getStockLogs(req, res) {
    try {
        const logs = await StockLog.find()
            .populate("product", "name sku")
            .populate("user", "name email")
            .populate("operationId", "type status")
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createStock(req, res) {
    try {
        const { product, warehouse, location, quantity } = req.body;

        const existingStock = await Stock.findOne({ product, warehouse, location });
        if (existingStock) return res.status(400).json({ error: "Stock entry already exists" });

        const stock = await Stock.create({ product, warehouse, location, quantity });
        res.status(201).json({ message: "Stock entry created", stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getStock(req, res) {
    try {
        const { product, warehouse, location, category, sku, search } = req.query;

        // Build filter object
        let filter = {};

        if (product) filter.product = product;
        if (warehouse) filter.warehouse = warehouse;
        if (location) filter.location = location;

        // Product search-based filters
        let query = Stock.find(filter);

        if (category || sku || search) {
            query = query.populate({
                path: "product",
                match: {
                    ...(category && { category }),
                    ...(sku && { sku }),
                    ...(search && { name: { $regex: search, $options: "i" } })
                },
                select: "name sku category"
            });
        } else {
            query = query.populate("product", "name sku category");
        }

        // Populate warehouse as needed
        query = query.populate("warehouse", "name code").sort({ createdAt: -1 });

        const stock = await query;

        // Remove entries where product filter made them `null`
        res.status(200).json(stock.filter(item => item.product));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getStockByProduct(req, res) {
    try {
        const stock = await Stock.find({ product: req.params.id })
            .populate("warehouse", "name code");

        if (!stock.length) return res.status(404).json({ error: "No stock found for this product" });
        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateStock(req, res) {
    try {
        const { quantity } = req.body;

        const stock = await Stock.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true }
        );

        if (!stock) return res.status(404).json({ error: "Stock record not found" });

        res.status(200).json({ message: "Stock updated", stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteStock(req, res) {
    try {
        await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Stock entry deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createStock,
    getStock,
    getStockByProduct,
    updateStock,
    deleteStock,
    getStockLogs
};
