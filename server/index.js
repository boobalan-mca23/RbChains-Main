require('dotenv').config()

const { connectDB } = require("./config/dbConnection.js");
const express = require("express");
const chalk = require("chalk");
const cors = require("cors");
const lotRoutes = require("./module/Lot/routes/lot.routes.js");
const customerRoutes = require("./module/Customer/routes/customer.routes.js");
const processRoutes = require("./module/Process/routes/process.routes.js");
const jewelTypeRoutes = require("./module/JewelType/routes/jewelType.routes.js");
const billRoutes = require("./module/Bill/routes/bill.routes.js");
const stockRoutes = require("./module/Stock/routes/stock.routes.js");
const receiptRoutes = require("./module/Receipt/routes/receipts.routes.js");


const app = express();
const PORT = process.env.PORT||5000;

app.use(cors());
app.use(express.json());
connectDB();
// Lot routes
app.use("/api/lot", lotRoutes);

// Customer routes
app.use("/api/customer", customerRoutes);

//Process routes

app.use("/api/process", processRoutes);

// JewelType routes
app.use("/api/jewelType", jewelTypeRoutes);

//Bill routes
app.use("/api/bill", billRoutes);

//Stock routes
app.use("/api/stock", stockRoutes);

app.use("/api/receipt", receiptRoutes);

app.listen(PORT, () => {
  console.log(chalk.green(`Server running on http://localhost:${PORT}`));
});
