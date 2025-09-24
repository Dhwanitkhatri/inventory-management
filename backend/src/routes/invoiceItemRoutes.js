const express = require("express");
const { 
  getInvoiceItems, 
  createInvoiceItem, 
  getInvoiceItemById, 
  updateInvoiceItem, 
  deleteInvoiceItem,

} = require("../controllers/invoiceItemsControllers");

const router = express.Router({ mergeParams: true });


router.get("/", getInvoiceItems);
router.get("/:itemId", getInvoiceItemById);

router.post("/", createInvoiceItem);
//router.post("/bulk", bulkCreateInvoiceItems);

router.patch("/:itemId", updateInvoiceItem);


router.delete("/:itemId", deleteInvoiceItem);



module.exports = router;
