const jwt = require("jsonwebtoken");
const User = require("../models/user.model")

const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.token;
            if (!token) return res.status(401).json({ message: "Unauthorized access" });

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            if (!decoded?.id) return res.status(401).json({ message: "Invalid token" });

            const u = await User.findById(decoded.id);

            req.user = u;

            if (roles.length && !roles.includes(u.role)) {
                return res.status(403).json({ message: "Forbidden: Access denied" });
            }

            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};

module.exports = auth;
