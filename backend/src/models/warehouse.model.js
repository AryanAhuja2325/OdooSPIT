const mongoose = require('mongoose')

const warehouseSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Warehouse name is required"] },
    code: { type: String, required: [true, "Warehouse code is required"], unique: true },
    locations: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model("Warehouse", warehouseSchema);
