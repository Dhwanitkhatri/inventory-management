const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Supplier  = sequelize.define('Supplier',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{isEmail:true}
    },
    phone:{
        type:DataTypes.CHAR(15),
        allowNull:false,
        validate:{
                is: {
                     args: /^\+?[0-9]{10,15}$/, // regex for 10-15 digits, optional +
                     msg: "Phone number must be 10-15 digits and can start with +",
                 }
          }
    },
    address:{
        type:DataTypes.STRING,
        allowNull:true
    }
})


module.exports = Supplier;