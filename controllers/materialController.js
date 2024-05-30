const asyncHandler = require("express-async-handler");
const Material = require("../models/materialModel")
const {fileSizeFormat} = require("../utils/fileUpload")
const cloudinary = require("cloudinary").v2;

const createMaterial = asyncHandler (async(req, res)=>{
    const {name, sku, category, quantity, price, description} = req.body

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
    //Create material
    const material = await Material.create({
        user: req.user.id,
        name, 
        sku,
        category,
        price,
        quantity,
        description,
        image: fileData
    })

    res.status(201).json(material)
});

// Get all Materials
const getMaterials = asyncHandler(async (req, res) => {
    const materials = await Material.find({ user: req.user.id }).sort("-createdAt");
    res.status(200).json(materials);
  });

//Get single material
const getMaterial = asyncHandler(async(req, res)=>{
    const material = await Material.findById(req.params.id)
    if(!material){
        res.status(400)
        throw new Error("Material not found")

    }
    if(material.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    res.status(200).json(material)
})

//Delete material
const deleteMaterial = asyncHandler(async(req, res)=>{
    const material = await Material.findById(req.params.id)
    if(!material){
        res.status(400)
        throw new Error("Material not found")

    }
    if(material.user.toString() !== req.user.id){
        res.status(400)
        throw new Error("User not authorized")
    }
    await material.deleteOne()
    res.status(200).json({message: "Material deleted"})
})

//Update material
const updateMaterial = asyncHandler (async(req, res)=>{
    const {name, category, quantity, price, description} = req.body
const {id} = req.params
    const material = await Material.findById(id)
    if(!material){
        res.status(400)
        throw new Error("Material not found")

    }
    if(material.user.toString() !== req.user.id){
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
    //update material
    const updatedMaterial = await Material.findByIdAndUpdate(
        {_id: id},
        {
            name, 
            category,
            price,
            quantity,
            description,
            image: Object.keys(fileData).length === 0 ? material?.image : fileData
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedMaterial)
});


module.exports = {
    createMaterial,
    getMaterials,
    getMaterial,
    deleteMaterial,
    updateMaterial,
}