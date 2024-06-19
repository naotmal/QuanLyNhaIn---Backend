const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel")
const Client = require("../models/clientModel")
const Delivery = require("../models/deliveryModel");
const Material = require("../models/materialModel");

const createTask = asyncHandler(async (req, res) => {
    const { name, progress, quantity, unit, clientId, description } = req.body

    //validation
    if (!name || !quantity || !description || !unit || !clientId) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    //Create task
    const task = await Task.create({

        name,
        progress,
        quantity,
        unit,
        clientId,
        description,
        createAt: Date.now(),
    });

    res.status(201).json(task)
});
// Get all Tasks
const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find().sort({ progress: 1, createdAt: -1 });
    res.status(200).json(tasks);
});

//Get single task
const getTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }


    res.status(200).json(task)
});

//get task by client
const getTaskbyClient = asyncHandler(async (req, res) => {
    const { clientId } = req.params;
    console.log(clientId);

    const task = await Task.find({ clientId: clientId }).sort("-createdAt");
    console.log(task);
    if (!task) {
        res.status(400)
        throw new Error("Task not found")
    }


    res.status(200).json(task)
});


//Delete task
const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }

    const delivery = await Delivery.findOne({ taskId: req.params.id })
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
    await delivery.deleteOne()
    await task.deleteOne()
    res.status(200).json({ message: "Task deleted" })
});

//Update task
const updateTask = asyncHandler(async (req, res) => {
    const { name, progress, quantity, unit, clientId, description } = req.body
    const { id } = req.params
    const task = await Task.findById(id)
    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }



    //update task
    const updatedTask = await Task.findByIdAndUpdate(
        { _id: id },
        {
            name, progress, quantity, unit, clientId, description,
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedTask)
});

//progress task
const changeProgress = asyncHandler(async (req, res) => {
    const { progress, id } = req.body
    const task = await Task.findById(id)
    if (!task) {
        res.status(500)
        throw new Error("Task not found");
    }

    task.progress = progress
    await task.save()
    res.status(200).json({
        message: `Task progress changed to ${progress}`
    })
})

module.exports = {
    createTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask,
    getTaskbyClient,
    changeProgress,

}