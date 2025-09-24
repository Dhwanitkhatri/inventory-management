const Product = require("../model/Product");
const {Op}=require("sequelize");
// Create
const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category } = req.body;

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: "Insufficient parameters" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All
const getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products); // return empty array if no products
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get By ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Merge only valid (non-null/undefined) values
    const updatedData = {};
    for (let key in req.body) {
      if (req.body[key] !== null && req.body[key] !== undefined) {
        updatedData[key] = req.body[key];
      }
    }

    await product.update(updatedData);

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get All Product Less Than 5
const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        quantity: {
          [Op.lt]: 5, // less than 5
        },
      },
    });
    

   if (products.length === 0) {
      return res.status(404).json({ message: "No low stock products found" });
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts
};
