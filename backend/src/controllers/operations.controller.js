const Operation = require("../models/operation.model");
const Stock = require("../models/stock.model");
const StockLog = require("../models/stocklog.model");
const Supplier = require("../models/supplier.model");
const Customer = require("../models/customer.model");

// 🔹 Helper: Update stock
async function updateStock(product, warehouse, location, quantityChange) {
    if (!warehouse || !location) {
        throw new Error("Warehouse and location required for stock update");
    }

    let stock = await Stock.findOne({ product, warehouse, location });

    if (!stock) {
        stock = await Stock.create({ product, warehouse, location, quantity: 0 });
    }

    stock.quantity += quantityChange;
    if (stock.quantity < 0) throw new Error("Insufficient stock");

    await stock.save();
    return stock;
}

// 🔹 Create Operation
async function createOperation(req, res) {
    try {
        const { type, supplier, customer, sourceWarehouse, destinationWarehouse, items } = req.body;

        if (!items?.length) {
            return res.status(400).json({ error: "At least one item is required" });
        }

        // --- Supplier / Customer Validation ---
        if (type === "RECEIPT") {
            if (!supplier) return res.status(400).json({ error: "Supplier is required for RECEIPT" });
            const existingSupplier = await Supplier.findById(supplier);
            if (!existingSupplier) return res.status(404).json({ error: "Supplier not found" });
        }

        if (type === "DELIVERY") {
            if (!customer) return res.status(400).json({ error: "Customer is required for DELIVERY" });
            const existingCustomer = await Customer.findById(customer);
            if (!existingCustomer) return res.status(404).json({ error: "Customer not found" });
        }

        if (type === "INTERNAL_TRANSFER" && (!sourceWarehouse || !destinationWarehouse)) {
            return res.status(400).json({ error: "Source and destination warehouse required for INTERNAL_TRANSFER" });
        }

        // Create operation
        const operation = await Operation.create({
            ...req.body,
            user: req.user.id,
            status: "WAITING"
        });

        res.status(201).json({ message: "Operation created", operation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 🔹 Process Operation
async function processOperation(req, res) {
    try {
        const operation = await Operation.findById(req.params.id);
        if (!operation) return res.status(404).json({ error: "Operation not found" });

        if (operation.status !== "WAITING")
            return res.status(400).json({ error: "Only WAITING operations can be processed" });

        // Supplier/customer revalidation (safety)
        if (operation.type === "RECEIPT" && !operation.supplier)
            return res.status(400).json({ error: "Cannot process - missing supplier" });

        if (operation.type === "DELIVERY" && !operation.customer)
            return res.status(400).json({ error: "Cannot process - missing customer" });

        // Stock handling
        for (const item of operation.items) {
            const { product, quantity } = item;

            switch (operation.type) {
                case "RECEIPT":
                    await updateStock(product, operation.destinationWarehouse, operation.destinationLocation, quantity);
                    break;
                case "DELIVERY":
                    await updateStock(product, operation.sourceWarehouse, operation.sourceLocation, -quantity);
                    break;
                case "INTERNAL_TRANSFER":
                    await updateStock(product, operation.sourceWarehouse, operation.sourceLocation, -quantity);
                    await updateStock(product, operation.destinationWarehouse, operation.destinationLocation, quantity);
                    break;
                case "ADJUSTMENT":
                    await updateStock(product, operation.sourceWarehouse, operation.sourceLocation, quantity);
                    break;
            }

            await StockLog.create({
                product,
                operationId: operation._id,
                type: operation.type,
                quantity,
                fromWarehouse: operation.sourceWarehouse,
                fromLocation: operation.sourceLocation,
                toWarehouse: operation.destinationWarehouse,
                toLocation: operation.destinationLocation,
                user: req.user.id
            });
        }

        operation.status = "DONE";
        await operation.save();

        res.status(200).json({ message: "Operation processed successfully", operation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 🔹 Cancel operation
async function cancelOperation(req, res) {
    try {
        const operation = await Operation.findById(req.params.id);
        if (!operation) return res.status(404).json({ error: "Operation not found" });

        if (operation.status !== "WAITING")
            return res.status(400).json({ error: "Only WAITING operations can be canceled" });

        operation.status = "CANCELED";
        await operation.save();

        res.status(200).json({ message: "Operation canceled", operation });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// 🔹 Get operations list
async function getOperations(req, res) {
    try {
        const { type, status, warehouse, product, supplier, customer, createdBy, from, to } = req.query;

        // Build dynamic filter object
        let filter = {};

        if (type) filter.type = type;
        if (status) filter.status = status;
        if (supplier) filter.supplier = supplier;
        if (customer) filter.customer = customer;
        if (createdBy) filter.user = createdBy;

        // Filter by date range
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        // Filter by product inside items array
        if (product) {
            filter["items.product"] = product;
        }

        // Filter by warehouse (either source or destination)
        if (warehouse) {
            filter.$or = [
                { sourceWarehouse: warehouse },
                { destinationWarehouse: warehouse }
            ];
        }

        const operations = await Operation.find(filter)
            .populate("user", "name")
            .populate("supplier", "name email")
            .populate("customer", "name email")
            .populate("items.product", "name sku")
            .populate("sourceWarehouse", "name")
            .populate("destinationWarehouse", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(operations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// 🔹 Get single operation
async function getOperation(req, res) {
    try {
        const operation = await Operation.findById(req.params.id)
            .populate("user", "name")
            .populate("supplier", "name email")
            .populate("customer", "name email")
            .populate("items.product", "name sku");

        if (!operation) return res.status(404).json({ error: "Operation not found" });

        res.status(200).json(operation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createOperation,
    processOperation,
    cancelOperation,
    getOperations,
    getOperation,
};
