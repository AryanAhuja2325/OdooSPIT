const express = require("express");
const wahrehouseRouter = express.Router();

const {
    createWarehouse,
    getWarehouses,
    getWarehouse,
    updateWarehouse,
    deleteWarehouse,
} = require("../controllers/warehouse.controller");

const auth = require("../middleware/auth.middleware");

wahrehouseRouter.post("/", auth(["INVENTORY_MANAGER", "ADMIN"]), createWarehouse);
wahrehouseRouter.put("/:id", auth(["INVENTORY_MANAGER", "ADMIN"]), updateWarehouse);
wahrehouseRouter.delete("/:id", auth(["ADMIN"]), deleteWarehouse);

wahrehouseRouter.get("/", auth(), getWarehouses);
wahrehouseRouter.get("/:id", auth(), getWarehouse);

module.exports = wahrehouseRouter;
