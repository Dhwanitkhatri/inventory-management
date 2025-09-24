const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} = require("../controllers/invoiceControllers");

// Get all invoices
router.get('/', authenticate, getAllInvoices);

// Get single invoice by ID
router.get('/:id', authenticate, getInvoiceById);

// Create invoice
router.post('/', authenticate, createInvoice);

// Update invoice
router.patch('/:id', authenticate, updateInvoice);

// Delete invoice
router.delete('/:id', authenticate, deleteInvoice);

module.exports = router;
