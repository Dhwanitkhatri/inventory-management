const InvoiceItem = require("../model/InvoiceItem");
const Product = require("../model/Product");
const Invoice = require("../model/Invoice");
const SuppliersLog = require("../model/SuppliesLog"); 
const { where, Sequelize } = require("sequelize");

// Create a new invoice item
const createInvoiceItem = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { productId, quantity} = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const item = await InvoiceItem.create({
      invoiceId,
      productId : product.id,
      quantity,
      price:product.price
    });
    await Product.decrement("quantity",{
      by : quantity,
      where : {id :product.id}
    })

    res.status(201).json({ message: "Invoice item created", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all items for an invoice
const getInvoiceItems = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const items = await InvoiceItem.findAll({
      where: { invoiceId },
      include: [{ model: Product, as: "product" }]
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single invoice item
const getInvoiceItemById = async (req, res) => {
  try {
    const { invoiceId, itemId } = req.params;
    const item = await InvoiceItem.findOne({
      where: { id: itemId, invoiceId },
      include: [{ model: Product, as: "product" }]
    });

    if (!item) {
      return res.status(404).json({ message: "Invoice item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an invoice item
const updateInvoiceItem = async (req, res) => {
  try {
    const { invoiceId, itemId } = req.params;
    const { quantity } = req.body;

    const item = await InvoiceItem.findOne({ where: { id: itemId, invoiceId } });
    if (!item) {
      return res.status(404).json({ message: "Invoice item not found" });
    }

    await item.update({
      quantity: quantity ?? item.quantity,
      
    });

    res.json({ message: "Invoice item updated", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an invoice item
const deleteInvoiceItem = async (req, res) => {
  try {
    const { invoiceId, itemId } = req.params;

    const item = await InvoiceItem.findOne({ where: { id: itemId, invoiceId } });
    if (!item) {
      return res.status(404).json({ message: "Invoice item not found" });
    }

    await item.destroy();
    res.json({ message: "Invoice item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

InvoiceItem.afterCreate(async (item) => {
  //  Update invoice total
  const invoice = await Invoice.findByPk(item.invoiceId, { include: ["items"] });
  const total = invoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  await invoice.update({ total });

  //  Stock deducted (new invoice item)
  await Product.decrement("quantity", { by: item.quantity, where: { id: item.productId } });

  //  Log it
  await SuppliersLog.create({
    productId: item.productId,
    invoiceItemId: item.id,
    change: -item.quantity, // negative = stock deducted
    reason: `Invoice ${item.invoiceId} created - stock deducted`
  });
});


InvoiceItem.afterUpdate(async (item) => {
  // Update invoice total
  const invoice = await Invoice.findByPk(item.invoiceId, { include: ["items"] });
  const total = invoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  await invoice.update({ total });

  // Find difference
  const oldQty = item._previousDataValues.quantity;
  const newQty = item.quantity;
  const diff = newQty - oldQty; 

  if (diff !== 0) {
    if (diff > 0) {
      await Product.decrement("quantity", { by: diff, where: { id: item.productId } });
    } else {
      await Product.increment("quantity", { by: Math.abs(diff), where: { id: item.productId } });
    }

    // Log once
    await SuppliersLog.create({
      productId: item.productId,
      invoiceItemId: item.id,
      change: -diff, // keep same sign convention
      reason: `Invoice ${item.invoiceId} updated - stock adjusted`
    });
  }
});


InvoiceItem.afterDestroy(async (item) => {
  //  Update invoice total
  const invoice = await Invoice.findByPk(item.invoiceId, { include: ["items"] });
  const total = invoice.items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
  await invoice.update({ total });

  //  Stock returned (item removed)
  await Product.increment("quantity", { by: item.quantity, where: { id: item.productId } });

  //  Log it
  await SuppliersLog.create({
    productId: item.productId,
    invoiceItemId: item.id,
    change: item.quantity, // positive = stock returned
    reason: `Invoice ${item.invoiceId} item deleted - stock returned`
  });
});

module.exports = {
  createInvoiceItem,
  getInvoiceItems,
  getInvoiceItemById,
  updateInvoiceItem,
  deleteInvoiceItem
};
