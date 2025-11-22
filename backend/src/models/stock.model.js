const mongoose = require('mongoose')

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product reference is required"]
    },
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: [true, "Warehouse reference is required"]
    },
    location: { type: String, required: [true, "Location is required"] },
    quantity: { type: Number, default: 0, min: [0, "Quantity cannot be negative"] }
}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);
