const express = require("express");
const router = express.Router();
const {authenticate, authorize}=require("../middleware/auth");
const {createProduct,getAllProduct,getProductById,updateProduct,deleteProduct,getLowStockProducts}=require("../controllers/productControllers");

router.get("/", authenticate, getAllProduct);
router.get("/low", authenticate, getLowStockProducts);
router.get("/:id", authenticate, getProductById);

router.post("/", authenticate, authorize("admin"), createProduct);
router.patch("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;