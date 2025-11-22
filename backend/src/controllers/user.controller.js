const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (role == 'ADMIN') {
            res.status(401).json({ message: "User cannot be registered as Admin" })
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "Email already exists" });

        await User.create({ name, email, password, role });
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        const token = await user.getJWT();

        res.cookie("token", token)

        res.status(200).json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getProfile(req, res) {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateProfile(req, res) {
    try {
        const { name } = req.body;

        await User.findByIdAndUpdate(req.user._id, { name });
        res.status(200).json({ message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function changePassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) return res.status(400).json({ error: "Incorrect old password" });

        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: "Password updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteUser(req, res) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    deleteUser,
};
