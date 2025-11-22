const mongoose = require('mongoose')

const stockLogSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product reference is required"]
    },
    type: { type: String, required: [true, "Log type is required"] },
    quantity: Number,
    fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    fromLocation: String,
    toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    toLocation: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    operationId: { type: mongoose.Schema.Types.ObjectId, ref: "Operation" }
}, { timestamps: true });

module.exports = mongoose.model("StockLog", stockLogSchema);
