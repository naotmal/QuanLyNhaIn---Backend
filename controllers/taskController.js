const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel")
const {fileSizeFormat} = require("../utils/fileUpload")
const cloudinary = require("cloudinary").v2;

const createTask = asyncHandler (async(req, res)=>{
    const {name, sku, category, quantity, price, description, completed} = req.body

    //validation
    if (!name || !category || !quantity || !price){
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    //handle image upload
    let fileData = {}
    if (req.file){
        //save file to cloud
        let uploadedFile;
        try{
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Quan Ly Nha In", resource_type: "image"})
        } catch (error){
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData ={
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormat( req.file.size, 2),
        }
    }
    //Create task
    const task = await Task.create({
        user: req.user.id,
        name, 
        sku,
        category,
        price,
        quantity,
        description,
        image: fileData,
completed,
    })

    res.status(201).json(task)
});

//Get all task
const getTasks = asyncHandler(async (req, res)=>{
    const tasks = await Task.find().sort("-createdAt")
    res.status(300).json(tasks)
    
});

//Get single task
const getTask = asyncHandler(async(req, res)=>{
    try{
        const {id} = req.params
        const tasks = await Task.findById(id)
        if(!task){
            return res.status(404).json(`No task found`)
        }
        res.status(200).json(tasks)

    }catch (error){
        res.status(500).json({msg: error.message})
    }
})

//Delete task
const deleteTask = asyncHandler(async(req, res)=>{
    try{
        const {id} = req.params
        const task = Task.findByIdAndDelete(id)
        if(!task){
            return res.status(404).json(`No task found`)
        }
        res.status(200).send("Task deleted")
    }catch (error){
        res.status(500).json({msg: error.message})
    }
})

//Update task
const updateTask = asyncHandler (async(req, res)=>{
    const {name, category, quantity, price, description} = req.body
const {id} = req.params
    const task = await Task.findById(id)
    if(!task){
        res.status(400)
        throw new Error("Task not found")

    }
    if(task.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    //handle image upload
    let fileData = {}
    if (req.file){
        //save file to cloud
        let uploadedFile;
        try{
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {folder: "Quan Ly Nha In", resource_type: "image"})
        } catch (error){
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData ={
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormat( req.file.size, 2),
        }
    }
    //update task
    const updatedTask = await Task.findByIdAndUpdate(
        {_id: id},
        {
            name, 
            category,
            price,
            quantity,
            description,
            image: Object.keys(fileData).length === 0 ? task?.image : fileData
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedTask)
});


module.exports = {
    createTask,
    getTasks,
    getTask,
    deleteTask,
    updateTask,
}