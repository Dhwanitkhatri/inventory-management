const express = require("express");
const router = express.Router();
const {authenticate, authorize}=require("../middleware/auth");
const {createCustomer,getAllCustomer,getCustomerById,updateCustomer,deleteCustomer,getInvoiceOfCustomer} = require("../controllers/customerControllers");

router.get("/:id/invoices", authenticate, getInvoiceOfCustomer);//issue Invoice is not associated to Customer

router.get("/",authenticate,getAllCustomer);//done
router.get("/:id",authenticate,getCustomerById);//done


router.patch("/:id",authenticate,authorize('admin'),updateCustomer);//done

router.post("/",authenticate,authorize('admin'),createCustomer);//done 

router.delete("/:id",authenticate,authorize('admin'),deleteCustomer);//done

module.exports = router;