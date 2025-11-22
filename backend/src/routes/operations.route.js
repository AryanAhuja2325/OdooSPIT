const express = require("express");
const operationsRouter = express.Router();

const {
    createOperation,
    processOperation,
    cancelOperation,
    getOperations,
    getOperation,
} = require("../controllers/operations.controller");

const auth = require("../middleware/auth.middleware");

// 🔹 Create operation (RECEIPT / DELIVERY / INTERNAL_TRANSFER / ADJUSTMENT)
operationsRouter.post("/", auth(["INVENTORY_MANAGER", "ADMIN"]), createOperation);

// 🔹 Process operation (updates stock & logs)
operationsRouter.put("/:id/process", auth(["INVENTORY_MANAGER", "ADMIN"]), processOperation);

// 🔹 Cancel operation
operationsRouter.put("/:id/cancel", auth(["INVENTORY_MANAGER", "ADMIN"]), cancelOperation);

// 🔹 Get all operations
operationsRouter.get("/", auth(), getOperations);

// 🔹 Get a single operation by ID
operationsRouter.get("/:id", auth(), getOperation);

module.exports = operationsRouter;
