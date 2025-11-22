const express = require("express");
const adminRouter = express.Router();
const auth = require("../middleware/auth.middleware");

const {
    addSupplier,
    addCustomer,
    updateSupplier,
    updateCustomer,
    getSuppliers,
    getCustomers,
    deleteSupplier,
    deleteCustomer
} = require("../controllers/admin.controller");

// Supplier routes
adminRouter.post("/supplier", auth(["ADMIN"]), addSupplier);
adminRouter.put("/supplier/:id", auth(["ADMIN"]), updateSupplier);
adminRouter.get("/supplier", auth(), getSuppliers);
adminRouter.delete("/supplier/:id", auth(["ADMIN"]), deleteSupplier);

// Customer routes
adminRouter.post("/customer", auth(["ADMIN"]), addCustomer);
adminRouter.put("/customer/:id", auth(["ADMIN"]), updateCustomer);
adminRouter.get("/customer", auth(), getCustomers);
adminRouter.delete("/customer/:id", auth(["ADMIN"]), deleteCustomer);

module.exports = adminRouter;
