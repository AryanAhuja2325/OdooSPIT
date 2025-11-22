const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Product name is required"] },
    sku: { type: String, required: [true, "SKU is required"], unique: true },
    category: { type: String },
    uom: { type: String, required: [true, "Unit of measure is required"] },
    reorderLevel: { type: Number, default: 0, min: [0, "Reorder level cannot be negative"] }
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
