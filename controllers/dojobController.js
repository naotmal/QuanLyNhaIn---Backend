const asyncHandler = require("express-async-handler");
const DoJob = require("../models/dojobModel");
const Job = require("../models/jobModel");
const Task = require("../models/taskModel");
const Delivery = require("../models/deliveryModel");
const Material = require ("../models/materialModel");
const { updateTask } = require("./taskController");

//create do job
const createDoJob = asyncHandler(async(req, res)=>{
    const {jobId} = req.body
    const {deliveryId} = req.params

    //validation
    if (!jobId ) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }
    const job = await Job.findById(jobId)
    const delivery = await Delivery.findById(deliveryId)
    if (!job) {
        res.status(400)
        throw new Error("Job not found")

    }

    if (!delivery) {
        res.status(400)
        throw new Error("Delivery not found")

    }
    const task = await Task.findById(delivery.taskId);
    if (!task) {
        res.status(400)
        throw new Error("Task not found")

    }
    
     // create do job
    const dojob = await new DoJob({
        deliveryId: deliveryId,
        jobId,
        price: parseInt(job.price)*parseInt(delivery.quantity)
     }).save()

     const taskPrice = await Task.findByIdAndUpdate(
        {_id: delivery.taskId},
        {
            price: parseInt(task.price) + parseInt(dojob.price)
        }
     )
      
     res.status(201).json(dojob)
     
})

//get all do job
const getDoJobs = asyncHandler(async(req, res)=>{
    const dojobs = await DoJob.find().sort("-createdAt")
    res.status(200).json(dojobs)
})

//Get do job by delivery
const getDoJobbyDelivery = asyncHandler(async (req, res) => {
    const { deliveryId } = req.params;
    console.log(deliveryId);

    const dojob = await DoJob.find({deliveryId: deliveryId}).sort("-createdAt")
    console.log(dojob);
    if (!dojob) {
        res.status(400)
        throw new Error("No job found")
    }


    res.status(200).json(dojob)
});

//Get do job by task
const getDoJobbyTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    
     const delivery = await Delivery.find({taskId: taskId})

     const dojob = await DoJob.find({deliveryId: { $in: delivery.map(d => d._id) }})
     
     if (!dojob) {
         res.status(400)
         throw new Error("No job found")
     }


    res.status(200).json(dojob)
});

//Get single do job
const getSingleDoJob = asyncHandler(async (req, res)=>{
    const dojob = await DoJob.findById(req.params.id)
    if(!dojob){
        res.status(400)
        throw new Error("No job found")
    }
    res.status(200).json(dojob)
})

//Delete dojob
const deleteDoJob = asyncHandler(async(req, res)=>{
    const dojob = await DoJob.findById(req.params.id)
    if(!dojob){
        res.status(400)
        throw new Error("No job found")
    }

    const delivery = await Delivery.findById(dojob.deliveryId);
    const job = await Job.findById(dojob.jobId);
    if (!delivery) {
        res.status(400);
        throw new Error("Delivery not found");
    }
    if (!job) {
        res.status(400);
        throw new Error("Job not found");
    }
    const task = await Task.findById(delivery.taskId);
    if (!task) {
        res.status(400);
        throw new Error("Task not found");
    }
    const priceDifference = parseInt(job.price) * parseInt(delivery.quantity);
    const updatedTask = await Task.findByIdAndUpdate(
        task._id,
        {
            price: parseInt(task.price) - priceDifference,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    await dojob.deleteOne()
    res.status(200).json({
        message: "DoJob deleted",
        updatedTask,
    });
})

//update do job
const updateDoJob = asyncHandler(async(req, res)=>{
    const {jobId} = req.body

    if (!jobId) {
        res.status(400);
        throw new Error("Job ID is required");
    }
    const dojob = await DoJob.findById(req.params.id);
    if (!dojob) {
        res.status(400);
        throw new Error("DoJob not found");
    }
    const delivery = await Delivery.findById(dojob.deliveryId);
    if (!delivery) {
        res.status(400);
        throw new Error("Delivery not found");
    }
    const task = await Task.findById(delivery.taskId);
    if (!task) {
        res.status(400);
        throw new Error("Task not found");
    }
    const oldJob = await Job.findById(dojob.jobId);
    if (!oldJob) {
        res.status(400);
        throw new Error("Old job not found");
    }
    const oldPriceDifference = parseInt(oldJob.price) * parseInt(delivery.quantity);
    dojob.jobId = jobId;
    await dojob.save();

    const newJob = await Job.findById(jobId);
    if (!newJob) {
        res.status(400);
        throw new Error("New job not found");
    }
    const newPriceDifference = parseInt(newJob.price) * parseInt(delivery.quantity);
    const updatedTask = await Task.findByIdAndUpdate(
        task._id,
        {
            price: parseInt(task.price) - oldPriceDifference + newPriceDifference,
        },
        {
            new: true,
            runValidators: true,
        }
    );
    res.status(200).json({
        message: "DoJob updated and task price adjusted",
        dojob,
        updatedTask,
    });
})

module.exports={
    createDoJob,
    getDoJobs,
    getDoJobbyDelivery,
    getSingleDoJob,
    deleteDoJob,
    updateDoJob,
    getDoJobbyTask,
}