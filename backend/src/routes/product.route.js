const express = require("express");
const productRouter = express.Router();

const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/product.controller");

const auth = require("../middleware/auth.middleware");

productRouter.post("/", auth(["INVENTORY_MANAGER", "ADMIN"]), createProduct);
productRouter.put("/:id", auth(["INVENTORY_MANAGER", "ADMIN"]), updateProduct);
productRouter.delete("/:id", auth(["ADMIN"]), deleteProduct);
productRouter.get("/", auth(), getProducts);
productRouter.get("/:id", auth(), getProduct);

module.exports = productRouter;
