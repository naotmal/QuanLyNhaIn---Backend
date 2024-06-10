const asyncHandler = require("express-async-handler");
const Delivery = require("../models/deliveryModel")
const Material = require("../models/materialModel")
const Task = require("../models/taskModel")


const createDelivery = asyncHandler (async(req, res)=>{
    const {materialId, taskId, quantity} = req.body

    //validation
    if (!materialId|| !quantity || !taskId){
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const material = await Material.findById(materialId)
    const task = await Task.findById(taskId)
    if(!material){
        res.status(400)
        throw new Error("Material not found")

    }
    if(!task){
        res.status(400)
        throw new Error("Task not found")

    }
    if(material.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    //Create delivery
    await new Delivery ({
        userId: req.user._id,
        materialId: material._id,
        taskId: task._id,
        quantity: quantity,
        createAt: Date.now(),
    }).save()
    res.status(200).json({
        message: "New delivery created"
    })
    const subtractQuantity = await Material.findByIdAndUpdate(
        {_id: material._id},
        {
            quantity: parseInt(material.quantity) - parseInt(quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedMaterial)
});
const getDelivery = asyncHandler(async(req, res)=>{
    const delivery = await Delivery.find({taskId: req.params.id }).sort("-createdAt");
    if(!delivery){
        res.status(400)
        throw new Error("Delivery not found")
    }
   
    
    res.status(200).json(delivery)
});
const deleteDelivery = asyncHandler(async(req, res)=>{
    const delivery = await Delivery.findById(req.params.id)
    if(!delivery){
        res.status(400)
        throw new Error
    }
    
    await delivery.deleteOne()
    res.status(200).json({message: "Delivery deleted"})
    const material = await Material.findById(delivery.materialId)
    const deleteQuantity = await Material.findByIdAndUpdate(
        {_id: material._id},
        {
            quantity: parseInt(material.quantity) + parseInt(delivery.quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json(deleteQuantity)
});
const updateDelivery = asyncHandler(async(req, res)=>{
    const {materialId, quantity} = req.body
     
     const delivery = await Delivery.findById(req.params.id)
     if(!delivery){
         res.status(400)
         throw new Error("Delivery not found")
     }
    
     const updateDelivery = await Delivery.findByIdAndUpdate(
         {_id: req.params.id},
         {
             quantity,
         },
         {
             new: true,
             runValidators: true
         }
     )
         res.status(200).json(updateDelivery)
         const material = await Material.findById(delivery.materialId)
         const deleteQuantity = await Material.findByIdAndUpdate(
             {_id: material._id},
             {
                 quantity: parseInt(material.quantity) + parseInt(delivery.quantity) - parseInt(updateDelivery.quantity),
             },
             {
                 new: true,
                 runValidators: true
             }
         )
         res.status(200).json(deleteQuantity)
 })

module.exports={
    createDelivery,
    getDelivery,
    deleteDelivery,
    updateDelivery,
}