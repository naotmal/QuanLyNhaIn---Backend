const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel")
const Client = require("../models/clientModel")

const createTask = asyncHandler (async(req, res)=>{
    const {name, progress, quantity, unit, clientId, description} = req.body

    //validation
    if (!name|| !quantity || !description || !unit || !clientId){
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    //Create task
    const task = await Task.create({
        userId: req.user.id,
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
    const tasks = await Task.find({ userId: req.user.id }).sort("-createdAt");
    res.status(200).json(tasks);
  });

  //Get single task
const getTask = asyncHandler(async(req, res)=>{
    const task = await Task.findById(req.params.id)
    if(!task){
        res.status(400)
        throw new Error("Task not found")

    }
    if(task.userId.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    
    res.status(200).json(task)
});

//Delete task
const deleteTask = asyncHandler(async(req, res)=>{
    const task = await Task.findById(req.params.id)
    if(!task){
        res.status(400)
        throw new Error("Task not found")

    }
    if(task.userId.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    await task.deleteOne()
    res.status(200).json({message: "Task deleted"})
});

//Update task
const updateTask = asyncHandler (async(req, res)=>{
    const {name, progress, quantity, unit, clientId, description} = req.body
const {id} = req.params
    const task = await Task.findById(id)
    if(!task){
        res.status(400)
        throw new Error("Task not found")

    }
    if(task.userId.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }

    
    
    //update task
    const updatedTask = await Task.findByIdAndUpdate(
        {_id: id},
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

module.exports={
    createTask,
    getTasks,
    getTask,
deleteTask,
updateTask,
}