const Warehouse = require("../models/warehouse.model");
const Stock = require("../models/stock.model");

async function createWarehouse(req, res) {
    try {
        const { name, code, locations } = req.body;

        const existing = await Warehouse.findOne({ code });
        if (existing) return res.status(400).json({ error: "Warehouse code already exists" });

        const warehouse = await Warehouse.create({ name, code, locations });
        res.status(201).json({ message: "Warehouse created", warehouse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


async function getWarehouses(req, res) {
    try {
        // Get warehouse list
        const warehouses = await Warehouse.find();

        // For each warehouse, compute stock sum
        const enriched = await Promise.all(
            warehouses.map(async (wh) => {
                const stockEntries = await Stock.find({ warehouse: wh._id });
                const stockSum = stockEntries.reduce(
                    (sum, s) => sum + (s.quantity || 0),
                    0
                );

                return {
                    ...wh._doc,
                    stockSum,
                };
            })
        );

        res.status(200).json(enriched);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getWarehouses };


async function getWarehouse(req, res) {
    try {
        const warehouse = await Warehouse.findById(req.params.id);
        if (!warehouse) return res.status(404).json({ error: "Warehouse not found" });

        res.status(200).json(warehouse);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateWarehouse(req, res) {
    try {
        const { name, locations } = req.body;

        const warehouse = await Warehouse.findByIdAndUpdate(
            req.params.id,
            { name, locations },
            { new: true }
        );

        if (!warehouse) return res.status(404).json({ error: "Warehouse not found" });

        res.status(200).json({ message: "Warehouse updated", warehouse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteWarehouse(req, res) {
    try {
        await Warehouse.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Warehouse deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createWarehouse,
    getWarehouses,
    getWarehouse,
    updateWarehouse,
    deleteWarehouse,
};
