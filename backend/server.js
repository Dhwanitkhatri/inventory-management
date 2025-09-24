require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import Sequelize instance
const sequelize = require("./src/config/db");

// Import models (so Sequelize registers them)
require("./src/model/Product");
require("./src/model/Customer");
require("./src/model/User");
require("./src/model/Invoice");
require("./src/model/InvoiceItem");
require("./src/model/SuppliesLog");
require("./src/model/Supplier");

// Import route modules
const authRoutes = require("./src/routes/authRoutes");
const customerRoutes = require("./src/routes/customerRoutes");
const invoiceRoutes = require("./src/routes/invoiceRoutes");
const invoiceItemRoutes = require("./src/routes/invoiceItemRoutes"); // nested under invoice
const productRoutes = require("./src/routes/productRoutes");
const supplierRoutes = require("./src/routes/supplierRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Base route
app.get("/", (req, res) => {
  res.send("Inventory Management API is running");
});

// Register APIs
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/invoices/:invoiceId/items", invoiceItemRoutes); // nested route
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

// Sync database and start server
sequelize
  .sync({ alter: true }) // { force: true } for dev reset
  .then(() => {
    console.log("All tables created/updated successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });
