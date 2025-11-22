const express = require("express");
const userRouter = express.Router();

const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    deleteUser,
} = require("../controllers/user.controller");

const auth = require("../middleware/auth.middleware");

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", auth(), getProfile);
userRouter.put("/profile", auth(), updateProfile);
userRouter.put("/change-password", auth(), changePassword);
userRouter.delete("/:id", auth(["ADMIN"]), deleteUser);

module.exports = userRouter;
