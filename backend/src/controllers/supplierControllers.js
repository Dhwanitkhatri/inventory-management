const Supplier = require("../model/Supplier");

// add new supplies 
const createSupplier = async(req,res)=>{
    try {
        const {name , email , phone , address} = req.body;

        if(!name || !email || !phone || !address)
            return res.status(400).json({message : "insufficient parameters"});

        const supplier = await Supplier.create({name , email , phone , address});

        res.status(201).json(supplier);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//get all suppliers 
const getAllSupplier = async(req,res)=>{
    try {
        const suppliers  = await Supplier.findAll();
        res.json(suppliers);

    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

//get supplier using id
const getSupplierById = async(req,res)=>{
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if(!supplier)
            return res.status(404).json({message:"supplier not found"});
        res.json(supplier);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//update supplier
const updateSupplier = async(req,res)=>{
    try {
        const supplier = await Supplier.findByPk(req.params.id);

        if(!supplier)
            return res.status(404).json({message :`${req.params.id} supplier not found`});

        const updatedData = {};
         for (let key in req.body) {
                    if (req.body[key] !== null && req.body[key] !== undefined) {
                      updatedData[key] = req.body[key];
                    }
             }
    await supplier.update(updatedData)

    res.json(supplier);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

const deleteSupplier = async(req,res)=>{
    try {
        const supplier = await Supplier.findByPk(req.params.id);
        if(!supplier)
            return res.status(404).json({message : `${req.params.id} supplier not found`});
        
        await supplier.destroy();
        res.json({message : "supplier delete"});
    } catch (error) {
        res.status(500).json({message : error.message})
    }
};

module.exports ={
    createSupplier,
    getAllSupplier,
    getSupplierById,
    updateSupplier,
    deleteSupplier
}