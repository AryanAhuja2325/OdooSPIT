const express = require("express");
const router = express.Router();

const {
    createStock,
    getStock,
    getStockByProduct,
    updateStock,
    deleteStock,
    getStockLogs
} = require("../controllers/stock.controller");

const auth = require("../middleware/auth.middleware");

router.post("/", auth(["INVENTORY_MANAGER", "ADMIN"]), createStock);
router.put("/:id", auth(["INVENTORY_MANAGER", "ADMIN"]), updateStock);
router.delete("/:id", auth(["ADMIN"]), deleteStock);

router.get("/", auth(), getStock);
router.get("/product/:id", auth(), getStockByProduct);
router.get("/stock-logs", auth(), getStockLogs);

module.exports = router;
