require('dotenv').config();
const sequelize = require('./src/config/db');

const Product = require('./src/model/Product');
const Supplier = require('./src/model/Supplier');
const Customer = require('./src/model/Customer');
const User = require('./src/model/User');
const Invoice = require('./src/model/Invoice');
const InvoiceItem = require('./src/model/InvoiceItem');

const bcrypt = require('bcrypt');

const seed = async () => {
  try {
    // Disable foreign key checks to allow safe dropping
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    // Sync database (drop & recreate tables)
    await sequelize.sync({ force: true });

    // Re-enable foreign key checks
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database synced.');

    const now = new Date();

    // ----- Users -----
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.bulkCreate([
      { username: 'admin', email: 'admin@example.com', password: hashedPassword, role: 'admin', createdAt: now, updatedAt: now },
      { username: 'staff1', email: 'staff1@example.com', password: hashedPassword, role: 'staff', createdAt: now, updatedAt: now },
    ]);
    console.log('Users seeded.');

    // ----- Suppliers -----
    await Supplier.bulkCreate([
      { name: 'ABC Suppliers', email: 'abc@suppliers.com', phone: '1234567890', address: '123 Street', createdAt: now, updatedAt: now },
      { name: 'XYZ Suppliers', email: 'xyz@suppliers.com', phone: '0987654321', address: '456 Avenue', createdAt: now, updatedAt: now },
    ]);
    console.log('Suppliers seeded.');

    // ----- Products -----
    await Product.bulkCreate([
      { name: 'Laptop', description: '14-inch Laptop', price: 55000, quantity: 20, category: 'Electronics', createdAt: now, updatedAt: now },
      { name: 'Mouse', description: 'Wireless Mouse', price: 800, quantity: 100, category: 'Electronics', createdAt: now, updatedAt: now },
      { name: 'Keyboard', description: 'Mechanical Keyboard', price: 2500, quantity: 50, category: 'Electronics', createdAt: now, updatedAt: now },
      { name: 'Monitor', description: '24-inch LED Monitor', price: 12000, quantity: 30, category: 'Electronics', createdAt: now, updatedAt: now },
      { name: 'Printer', description: 'Laser Printer', price: 15000, quantity: 15, category: 'Electronics', createdAt: now, updatedAt: now },
    ]);
    console.log('Products seeded.');

    // ----- Customers -----
    await Customer.bulkCreate([
      { name: 'John Doe', email: 'john@example.com', phone: '1111111111', address: '123 Main St', createdAt: now, updatedAt: now },
      { name: 'Jane Smith', email: 'jane@example.com', phone: '2222222222', address: '456 Broadway', createdAt: now, updatedAt: now },
    ]);
    console.log('Customers seeded.');

    // ----- Invoices -----
    await Invoice.bulkCreate([
      { invoice_number: 'INV001', CustomerId: 1, userId: 1, total_amount: 60000, status: 'pending', createdAt: now, updatedAt: now },
      { invoice_number: 'INV002', CustomerId: 2, userId: 2, total_amount: 1500, status: 'paid', createdAt: now, updatedAt: now },
    ]);
    console.log('Invoices seeded.');

    // ----- InvoiceItems -----
   await InvoiceItem.bulkCreate([
  { invoiceId: 1, productId: 1, quantity: 1, price: 55000, total: 55000, createdAt: now, updatedAt: now },
  { invoiceId: 1, productId: 2, quantity: 1, price: 5000, total: 5000, createdAt: now, updatedAt: now },
  { invoiceId: 2, productId: 2, quantity: 2, price: 800, total: 1600, createdAt: now, updatedAt: now },
]);

    console.log('InvoiceItems seeded.');

    console.log('All data seeded successfully.');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await sequelize.close();
  }
};

seed();
