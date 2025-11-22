const express = require("express");
const analyticsRouter = express.Router();
const auth = require("../middleware/auth.middleware");

const { getInventoryAnalytics } = require("../controllers/analytics.controller");

analyticsRouter.get("/", auth(), getInventoryAnalytics);

module.exports = analyticsRouter;
