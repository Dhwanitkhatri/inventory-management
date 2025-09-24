const express = require("express");
const {authenticate, authorize}=require("../middleware/auth");
const router = express.Router();
const {createSupplier,getAllSupplier,getSupplierById,updateSupplier,deleteSupplier} = require("../controllers/supplierControllers");

router.get('/',authenticate,getAllSupplier);
router.get('/:id',authenticate,getSupplierById);

router.post('/',authenticate,authorize('admin'),createSupplier);

router.patch('/:id',authenticate,authorize('admin'),updateSupplier);

router.delete('/:id',authenticate,authorize('admin'),deleteSupplier);

module.exports = router;