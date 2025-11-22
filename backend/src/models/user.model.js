const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    role: {
        type: String,
        enum: ["INVENTORY_MANAGER", "WAREHOUSE_STAFF", "ADMIN"],
        default: "WAREHOUSE_STAFF",
    }
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.getJWT = async function () {
    return jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '7d' });
};

module.exports = mongoose.model("User", userSchema);
