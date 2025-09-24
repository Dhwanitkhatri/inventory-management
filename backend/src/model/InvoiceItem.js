const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const Invoice = require("./Invoice");
const Product = require("./Product");

const InvoiceItem = sequelize.define('InvoiceItem',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    invoiceId :{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Invoice,
            key:'id'
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Product,
            key:'id'
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false
    },
    total:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        defaultValue:0
    }
});

//brfore creating the a new invoice 
InvoiceItem.beforeCreate(item =>{
    if(item.quantity <= 0 || item.price <0)
        throw new Error("quantity and price must be positive");
        
    item.total = (item.quantity * item.price).toFixed(2);
    
});
//before updating the value 
InvoiceItem.beforeUpdate(item =>{
    if(item.quantity <= 0 || item.price <0)
        throw new Error("quantity and price must be positive");
    
    item.total = (item.quantity * item.price).toFixed(2);
    
});
InvoiceItem.afterCreate((item) => recalcInvoiceTotal(item.invoiceId));
InvoiceItem.afterUpdate((item) => recalcInvoiceTotal(item.invoiceId));
InvoiceItem.afterDestroy((item) => recalcInvoiceTotal(item.invoiceId));


async function recalcInvoiceTotal(invoiceId) {
    const items = await InvoiceItem.findAll({ where: { invoiceId } });
    const sum = items.reduce((acc, it) => acc + parseFloat(it.total), 0);
    await Invoice.update({ total_amount: sum.toFixed(2) }, { where: { id: invoiceId } });
}



module.exports = InvoiceItem;