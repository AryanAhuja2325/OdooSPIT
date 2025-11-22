const Stock = require("../models/stock.model");
const Operation = require("../models/operation.model");
const Product = require("../models/product.model");

async function getInventoryAnalytics(req, res) {
    try {
        // 1. Total Products in Stock (sum of all stock quantities)
        const totalStockAgg = await Stock.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);
        const totalProductsInStock = totalStockAgg[0]?.total || 0;

        // 2. Low stock / out of stock items
        const lowStockItems = await Stock.find()
            .populate("product", "name reorderLevel uom")
            .populate("warehouse", "name")
            .then(stocks =>
                stocks
                    .filter(s => s.product && s.product.reorderLevel > 0 && s.quantity < s.product.reorderLevel)
                    .map(s => ({
                        product: s.product.name,
                        current: s.quantity,
                        min: s.product.reorderLevel,
                        uom: s.product.uom,
                        warehouse: s.warehouse?.name
                    }))
            );
        const lowStockCount = lowStockItems.length;

        // 3. Pending Receipts
        const pendingReceipts = await Operation.countDocuments({
            type: "RECEIPT",
            status: "WAITING"
        });

        // 4. Pending Deliveries
        const pendingDeliveries = await Operation.countDocuments({
            type: "DELIVERY",
            status: "WAITING"
        });

        // 5. Internal Transfers Scheduled
        const pendingInternalTransfers = await Operation.countDocuments({
            type: "INTERNAL_TRANSFER",
            status: "WAITING"
        });

        res.status(200).json({
            totalProductsInStock,
            lowStockCount,
            pendingReceipts,
            pendingDeliveries,
            pendingInternalTransfers,
            lowStockItems
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getInventoryAnalytics
};
