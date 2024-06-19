const asyncHandler = require("express-async-handler");
const Delivery = require("../models/deliveryModel")
const Material = require("../models/materialModel")
const Task = require("../models/taskModel")

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
    console.log("taskId:", taskId);

    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }

    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }

    //Create delivery
    await new Delivery({

        materialId,
        taskId: taskId,
        quantity,
        createAt: Date.now(),
    }).save()
    res.status(200).json({
        message: "New delivery created"
    })
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

    res.status(200).json(updatedMaterial)
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
    const deliveries = await Delivery.find({ userId: req.user.id }).sort("-createAt")
    res.status(200).json(deliveries)
})


//delete delivery
const deleteDelivery = asyncHandler(async (req, res) => {
    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) {
        res.status(400)
        throw new Error
    }

    await delivery.deleteOne()
    res.status(200).json({ message: "Delivery deleted" })
    const material = await Material.findById(delivery.materialId)
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
    res.status(200).json(deleteQuantity)
});

//update delivery
const updateDelivery = asyncHandler(async (req, res) => {
    const { materialId, quantity } = req.body

    const delivery = await Delivery.findById(req.params.id)
    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")
    }

    const updateDelivery = await Delivery.findByIdAndUpdate(
        { _id: req.params.id },
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
        { _id: material._id },
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

module.exports = {
    createDelivery,
    getDeliverybyTask,
    getDeliverybyMaterial,
    deleteDelivery,
    updateDelivery,
    getDeliveries,
    getSingleDelivery,
}