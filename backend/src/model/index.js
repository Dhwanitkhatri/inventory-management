const sequelize = require("../config/db");

// Import models
const User = require("./User");
const Product = require("./Product");
const Supplier = require("./Supplier");
const Customer = require("./Customer");
const Invoice = require("./Invoice");
const InvoiceItem = require("./InvoiceItem");

// ================== Associations ================== //

// Invoice ↔ InvoiceItem
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "items" });
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

// Product ↔ InvoiceItem
Product.hasMany(InvoiceItem, { foreignKey: "productId", as: "invoiceItems" });
InvoiceItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Invoice ↔ Customer
Invoice.belongsTo(Customer, { foreignKey: "CustomerId", as: "customer" });
Customer.hasMany(Invoice, { foreignKey: "CustomerId", as: "invoices" });

// Invoice ↔ User
Invoice.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Invoice, { foreignKey: "userId", as: "invoices" });



// ================================================== //

module.exports = {
  sequelize,
  User,
  Product,
  Supplier,
  Customer,
  Invoice,
  InvoiceItem,
};
