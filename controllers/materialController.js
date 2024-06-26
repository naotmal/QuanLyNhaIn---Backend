const asyncHandler = require("express-async-handler");
const Material = require("../models/materialModel")
const { fileSizeFormat } = require("../utils/fileUpload");
const Receipt = require("../models/receiptModel");
const cloudinary = require("cloudinary").v2;


const createMaterial = asyncHandler(async (req, res) => {
    const { name, sku, category, description, price } = req.body

    //validation
    if (!name || !category || !price) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }

    //handle image upload
    let fileData = {}
    if (req.file) {
        //save file to cloud
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Quan Ly Nha In", resource_type: "image" })
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormat(req.file.size, 2),
        }
    }
    //Create material
    const material = await Material.create({
        name,
        sku,
        category,
        price,
        description,
        image: fileData
    })

    res.status(201).json(material)
});

// Get all Materials
const getMaterials = asyncHandler(async (req, res) => {
    const materials = await Material.find().sort({quantity: 1, name: 1  });
    res.status(200).json(materials);
});

//Get single material
const getMaterial = asyncHandler(async (req, res) => {
    const material = await Material.findById(req.params.id)
    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }

    res.status(200).json(material)
})

//Delete material
const deleteMaterial = asyncHandler(async (req, res) => {
    const material = await Material.findById(req.params.id)
    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }
await Receipt.deleteMany({materialId: req.params.id})

await material.deleteOne()
res.status(200).json({message: "Material deleted successfully"})
})



//Update material
const updateMaterial = asyncHandler(async (req, res) => {
    const { name, category, description, price } = req.body
    const { id } = req.params
    const material = await Material.findById(id)
    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }

    //handle image upload
    let fileData = {}
    if (req.file) {
        //save file to cloud
        let uploadedFile;
        try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, { folder: "Quan Ly Nha In", resource_type: "image" })
        } catch (error) {
            res.status(500)
            throw new Error("Image could not be uploaded")
        }
        fileData = {
            fileName: req.file.originalname,
            filePath: uploadedFile.secure_url,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormat(req.file.size, 2),
        }
    }


    //update material
    const updatedMaterial = await Material.findByIdAndUpdate(
        { _id: id },
        {
            name,
            category,
            price,
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