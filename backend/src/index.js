require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const { connect } = require("./config/db");

const userRouter = require('./routes/user.route');
const productRouter = require('./routes/product.route');
const wahrehouseRouter = require('./routes/warehouse.route');
const operationsRouter = require('./routes/operations.route');
const adminRouter = require('./routes/admin.route');
const stockRouter = require('./routes/stock.route');
const analyticsRouter = require('./routes/analytics.route');

const app = express();

app.use(express.json());
app.use(
    cors({
        origin: ["http://localhost:8080", "https://inter-view-mate.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/warehouse', wahrehouseRouter);
app.use('/api/admin', adminRouter);
app.use('/api/operations', operationsRouter);
app.use('/api/stock', stockRouter);
app.use('/api/analytics', analyticsRouter);

app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.url);
    next();
});


connect()
    .then(() => {
        console.log("✅ Connected to database".cyan);
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT}`.magenta);
        });
    })
    .catch((err) => console.log("❌ Database connection failed".red, err));