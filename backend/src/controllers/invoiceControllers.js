const { Invoice, InvoiceItem, User, Customer, Product, sequelize } = require("../model");
const SuppliesLog = require("../model/SuppliesLog");

// Create a new invoice (with automatic stock update and supplies log)
const createInvoice = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { CustomerId, userId, status, items } = req.body;

    // Validate customer
    const customer = await Customer.findByPk(CustomerId);
    if (!customer) throw new Error("Invalid CustomerId");

    // Validate user
    const user = await User.findByPk(userId);
    if (!user) throw new Error("Invalid userId");

    // Create invoice
    const invoice = await Invoice.create(
      { CustomerId,  invoice_number: `INV-${Date.now()}`,userId, status, total_amount: 0 },
      { transaction: t }
    );

    let totalAmount = 0;

    // Create invoice items and update stock
    if (items && items.length) {
      for (let item of items) {
        const product = await Product.findByPk(item.productId);
        if (!product) throw new Error(`Product ID ${item.productId} not found`);

        // Check stock
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Create InvoiceItem
        await InvoiceItem.create(
          {
            invoiceId: invoice.id,
            productId: product.id,
            quantity: item.quantity,
            price: product.price,
          },
          { transaction: t }
        );

        // Update product stock
        product.quantity -= item.quantity;
        await product.save({ transaction: t });

        // Automatically log in SuppliesLog
        await SuppliesLog.create(
          {
            productId: product.id,
            change: -item.quantity, // negative for sold stock
            reason: `Sold via invoice #${invoice.id}`,
          },
          { transaction: t }
        );

        totalAmount += item.quantity * product.price;
      }
    }

    // Update total amount
    invoice.total_amount = totalAmount;
    await invoice.save({ transaction: t });

    await t.commit();

    // Return invoice with associations
    const newInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: Customer, as: "customer" },
        { model: User, as: "user" },
        { model: InvoiceItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
    });

    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    if (t) await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

// Get all invoices
const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Customer, as: "customer" },
        { model: User, as: "user" },
        { model: InvoiceItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoice by ID
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Customer, as: "customer" },
        { model: User, as: "user" },
        { model: InvoiceItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
    });

    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update invoice
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Validate customerId if provided
    if (req.body.customerId) {
      const customer = await Customer.findByPk(req.body.customerId);
      if (!customer) return res.status(400).json({ message: "Invalid customerId" });
    }

    // Validate userId if provided
    if (req.body.userId) {
      const user = await User.findByPk(req.body.userId);
      if (!user) return res.status(400).json({ message: "Invalid userId" });
    }

    await invoice.update(req.body, { fields: ["customerId", "userId", "status"] });

    // Return updated invoice with associations
    const updatedInvoice = await Invoice.findByPk(invoice.id, {
      include: [
        { model: Customer, as: "customer" },
        { model: User, as: "user" },
        { model: InvoiceItem, as: "items", include: [{ model: Product, as: "product" }] },
      ],
    });

    res.json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete invoice
const deleteInvoice = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: InvoiceItem, as: "items" }],
    });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    // Revert stock and remove SuppliesLog entries
    for (const item of invoice.items) {
      const product = await Product.findByPk(item.productId, { transaction: t });
      if (product) {
        product.quantity += item.quantity; // revert stock
        await product.save({ transaction: t });
      }

      await SuppliesLog.destroy({
        where: {
          productId: item.productId,
          reason: `Sold via invoice #${invoice.id}`,
        },
        transaction: t,
      });
    }
    await InvoiceItem.destroy({
      where:{
        invoiceId:invoice.id
      },
      transaction:t
    })
    await invoice.destroy({ transaction: t });
    await t.commit();

    res.json({ message: "Invoice deleted and stock reverted successfully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInvoice, getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice };
