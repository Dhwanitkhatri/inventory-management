const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Customer = require("./Customer");

const Invoice = sequelize.define('Invoice',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    invoice_number:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    CustomerId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Customer,
            key:'id'
        }
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        }
    },
    total_amount :{
        type:DataTypes.DECIMAL(10,2),
        allowNull:true,
        defaultValue:0
    },
    status:{
        type:DataTypes.ENUM('pending','paid','cancelled'),
        allowNull:false,
        defaultValue:'pending'
    }
});


module.exports=Invoice;