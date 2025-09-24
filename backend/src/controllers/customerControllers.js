const Customer = require("../model/Customer");
const Invoice = require("../model/Invoice");

// Add new customer 
const createCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name || !email || !phone || !address) {
            return res.status(400).json({ success: false, message: "Insufficient parameters" });
        }

        const customer = await Customer.create({ name, email, phone, address });
        res.status(201).json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// List all customers 
const getAllCustomer = async (req, res) => {
    try {
        const customers = await Customer.findAll();
        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get customer by ID 
const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }
        res.json({ success: true, customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update customer 
const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const updatedData = {};
        for (let key in req.body) {
            if (req.body[key] !== null && req.body[key] !== undefined) {
                updatedData[key] = req.body[key];
            }
        }

        await customer.update(updatedData);
        res.json({ success: true, message: "Customer updated successfully", customer });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete customer 
const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        await customer.destroy();
        res.json({ success: true, message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all invoices of a customer 
const getInvoiceOfCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
    include: {
        model: Invoice,
        as: "invoices",
        where: { CustomerId: req.params.id }// filter invoices by CustomerId
      
    }
});
    console.log(customer);
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.json({
            success: true,
            customer: {
                id: customer.id,
                name: customer.name,
                invoices: customer.invoices
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomer,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getInvoiceOfCustomer
};
