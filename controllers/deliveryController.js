const asyncHandler = require("express-async-handler");
const Delivery = require("../models/deliveryModel")
const Material = require("../models/materialModel")
const Task = require("../models/taskModel");
const Receipt = require("../models/receiptModel");
const DoJob = require("../models/dojobModel");

//Create delivery
const createDelivery = asyncHandler(async (req, res) => {
    const { materialId, quantity } = req.body
    const { taskId } = req.params

    //validation
    if (!materialId || !quantity) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const material = await Material.findById(materialId)
    const task = await Task.findById(taskId)

    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }

    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }
   
    const price = parseInt(material.price) * parseInt(quantity);
    //Create delivery
    const newDelivery = await new Delivery({

        materialId,
        taskId: taskId,
        quantity,
        price,
        createAt: Date.now(),
    }).save()
    
    const taskPrice = await Task.findByIdAndUpdate(
        {_id: taskId},
        {
            price: parseInt(task.price) + parseInt(price)
        },
        {
            new: true,
            runValidators: true,
        }
    )
    const subtractQuantity = await Material.findByIdAndUpdate(
        { _id: material._id },
        {
            quantity: parseInt(material.quantity) - parseInt(quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json({
        newDelivery,
        taskPrice,
        subtractQuantity,
        
    })
});

//Get delivery by task
const getDeliverybyTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    console.log(taskId);

    const delivery = await Delivery.find({ taskId: taskId }).sort("-createdAt");
    console.log(delivery);
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }


    res.status(200).json(delivery)
});
//Get delivery by material
const getDeliverybyMaterial = asyncHandler(async (req, res) => {
    const { materialId } = req.params;
    console.log(materialId);

    const delivery = await Delivery.find({ materialId: materialId }).sort("-createdAt");
    console.log(delivery);
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }


    res.status(200).json(delivery)
});

//Get single delivery 
const getSingleDelivery = asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }

    res.status(200).json(delivery)
})

//get all deliveries
const getDeliveries = asyncHandler(async (req, res) => {
    const deliveries = await Delivery.find().sort("-createAt")
    res.status(200).json(deliveries)
})


//delete delivery
const deleteDelivery = asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id)
    const task = await Task.findById(delivery.taskId)
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }
    if (!task) {
        res.status(400)
        throw new Error("Delivery not found")
    }

    const material = await Material.findById(delivery.materialId)
    if (!material) {
        res.status(400);
        throw new Error("Material not found");
    }

    const priceToSubtract = parseInt(delivery.price);
    await DoJob.deleteMany({deliveryId: req.params.id})
    await delivery.deleteOne()
    
    const taskPrice = await Task.findByIdAndUpdate(
        {_id: task._id},
        {
            price: parseInt(task.price) - parseInt(priceToSubtract)
        },
        {
            new: true,
            runValidators: true,
        }
    )
    
    const deleteQuantity = await Material.findByIdAndUpdate(
        { _id: material._id },
        {
            quantity: parseInt(material.quantity) + parseInt(delivery.quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json({
        message: "Delivery deleted",
        updatedTask,
        updatedMaterial,
    });
});

//update delivery
const updateDelivery = asyncHandler(async (req, res) => {
    const { materialId, quantity } = req.body

    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }

    const material = await Material.findById(delivery.materialId)
    if (!material) {
        res.status(400);
        throw new Error("Material not found");
    }

    const task = await Task.findById(delivery.taskId);
    if (!task) {
        res.status(400);
        throw new Error("Task not found");
    }

    const oldPrice = parseInt(delivery.price);
    const newPrice = parseInt(material.price) * parseInt(quantity);
    const priceDifference = newPrice - oldPrice;
    const updateDelivery = await Delivery.findByIdAndUpdate(
        { _id: req.params.id },
        {
            quantity,
            price: newPrice,

        },
        {
            new: true,
            runValidators: true
        }
    )
    
    
    const deleteQuantity = await Material.findByIdAndUpdate(
        { _id: material._id },
        {
            quantity: parseInt(material.quantity) + parseInt(delivery.quantity) - parseInt(updateDelivery.quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )

    const taskPrice = await Task.findByIdAndUpdate(
        {_id: task._id},
        {
            price: parseInt(task.price) + priceDifference,
        }
        ,
        {
            new: true,
            runValidators: true,
        }
    )
    res.status(200).json({
        message: "Delivery updated successfully",
        updatedDelivery,
        updatedMaterial,
        updatedTask,
    });
})



module.exports = {
    createDelivery,
    getDeliverybyTask,
    getDeliverybyMaterial,
    deleteDelivery,
    updateDelivery,
    getDeliveries,
    getSingleDelivery,
   
}