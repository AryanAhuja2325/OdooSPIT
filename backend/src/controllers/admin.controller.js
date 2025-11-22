const Supplier = require("../models/supplier.model");
const Customer = require("../models/customer.model");

// Add supplier
async function addSupplier(req, res) {
    try {
        const supplier = await Supplier.create(req.body);
        res.status(201).json({ message: "Supplier added", supplier });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Add customer
async function addCustomer(req, res) {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({ message: "Customer added", customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update supplier
async function updateSupplier(req, res) {
    try {
        const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!supplier) return res.status(404).json({ error: "Supplier not found" });
        res.status(200).json({ message: "Supplier updated", supplier });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update customer
async function updateCustomer(req, res) {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!customer) return res.status(404).json({ error: "Customer not found" });
        res.status(200).json({ message: "Customer updated", customer });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get all suppliers
async function getSuppliers(req, res) {
    try {
        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get all customers
async function getCustomers(req, res) {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete Supplier
async function deleteSupplier(req, res) {
    try {
        await Supplier.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Supplier deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete Customer
async function deleteCustomer(req, res) {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Customer deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    addSupplier,
    addCustomer,
    updateSupplier,
    updateCustomer,
    getSuppliers,
    getCustomers,
    deleteSupplier,
    deleteCustomer,
};
