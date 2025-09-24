const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");
const Product = require("./Product");

const SuppliesLog = sequelize.define('SuppliesLog',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true        
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:Product,
            key:'id'
        }
    },
    change:{
        type:DataTypes.INTEGER,
        allowNull:false,
        comment:'positive for added stock and negative for removed stock'
    },
    reason:{
        type:DataTypes.STRING,
        allowNull:false
    }
})


SuppliesLog.belongsTo(Product,{foreignKey:'productId',as:'product'})

module.exports=SuppliesLog;