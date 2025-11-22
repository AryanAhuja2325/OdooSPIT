const Warehouse = require("../models/warehouse.model");

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
        const warehouses = await Warehouse.find().sort({ createdAt: -1 });
        res.status(200).json(warehouses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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
