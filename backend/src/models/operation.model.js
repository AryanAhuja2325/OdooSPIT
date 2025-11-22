const mongoose = require('mongoose')

const operationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["RECEIPT", "DELIVERY", "INTERNAL_TRANSFER", "ADJUSTMENT"],
        required: [true, "Operation type is required"]
    },
    status: {
        type: String,
        enum: ["WAITING", "DONE", "CANCELED"],
        default: "WAITING"
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sourceWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    sourceLocation: { type: String },
    destinationWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
    destinationLocation: { type: String },

    // Separated models
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },

    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Operation", operationSchema);
