const { DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name :{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    description:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:0
    },
    price:{
        type:DataTypes.DECIMAL(10,2),
        allowNull:false,
        validate:{
            min:0
        }
    },
    quantity:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            min:0
        }
    },
    category:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    timestamps:true
})

module.exports = Product;