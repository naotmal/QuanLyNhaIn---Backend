const asyncHandler = require("express-async-handler");
const Job = require ("../models/jobModel")

//create job
const createJob = asyncHandler(async(req, res)=>{
    const {name, price, description} = req.body

    //validation
    if (!name  || !price) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    //create job
    const job = await Job.create({
        name,
        price,
        description,
    })
    res.status(201).json(job)
})

//Get all jobs
const getJobs = asyncHandler(async(req, res)=>{
    const jobs = await Job.find().sort({name: 1})
    res.status(200).json(jobs)
})

//Get single job
const getJob = asyncHandler(async(req, res)=>{
    const job = await Job.findById(req.params.id)
    if(!job) {
        res.status(400)
        throw new Error("Job not found")
    }
    res.status(200).json(job)
})

//delete job
const deleteJob = asyncHandler(async(req, res)=>{
    const job = await Job.findById(req.params.id)
    if(!job) {
        res.status(400)
        throw new Error("Job not found")
    }
    await job.deleteOne()
    res.status(200).json({message: "Job deleted"})
})

//update job
const updateJob = asyncHandler(async(req, res)=>{
    const {name, price, description} = req.body
    const {id} = req.params
    const job = await Job.findById(id)
    if(!job) {
        res.status(400)
        throw new Error("Job not found")
    }

    const updateJob = await Job.findByIdAndUpdate(
        {_id: id},
        {
            name,
            price,
            description,
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updateJob)
})

module.exports={
    createJob,
    getJobs,
    getJob,
    deleteJob,
    updateJob,
}