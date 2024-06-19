

const asyncHandler = require("express-async-handler");
const Material = require("../models/materialModel")

const Receipt = require("../models/receiptModel")



const createReceipt = asyncHandler(async (req, res) => {
    const { quantity } = req.body
    const { id } = req.params
    const material = await Material.findById(id)
    //validation
    if (!quantity ) {
        res.status(400)
        throw new Error("Please fill in all fields")
    }


    if (!material) {
        res.status(400)
        throw new Error("Material not found")

    }

    //create receipt

    const receipt = await Receipt.create({

        materialId: id,
        quantity,
        
        createAt: Date.now(),
    })
    res.status(201).json(receipt)

    const sumQuantity = await Material.findByIdAndUpdate(
        { _id: id },
        {
            quantity: parseInt(material.quantity) + parseInt(quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(sumQuantity)
    console.log(id);
});

//Get receipt by material
const getReceipt = asyncHandler(async (req, res) => {
    const receipt = await Receipt.find({ materialId: req.params.id }).sort("-createdAt");
    if (!receipt) {
        res.status(400)
        throw new Error("Receipt not found")
    }


    res.status(200).json(receipt)
});
//Get single receipt
const getSingleReceipt = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)
    if (!receipt) {
        res.status(400)
        throw new Error("Receipt not found")
    }

    res.status(200).json(receipt)
})

// Get all receipts
const getReceipts = asyncHandler(async (req, res) => {
    const receipt = await Receipt.find().sort("-createdAt");
    res.status(200).json(receipt);
});
//delete receipt
const deleteReceipt = asyncHandler(async (req, res) => {
    const receipt = await Receipt.findById(req.params.id)

    if (!receipt) {
        res.status(400)
        throw new Error
    }

    await receipt.deleteOne()
    res.status(200).json({ message: "Receipt deleted" })
    const material = await Material.findById(receipt.materialId)
    const deleteQuantity = await Material.findByIdAndUpdate(
        { _id: material._id },
        {
            quantity: parseInt(material.quantity) - parseInt(receipt.quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json(deleteQuantity)
});
//updatereceipt
const updateReceipt = asyncHandler(async (req, res) => {
    const { materialId, quantity } = req.body

    const receipt = await Receipt.findById(req.params.id)
    if (!receipt) {
        res.status(400)
        throw new Error("Receipt not found")
    }

    const updateReceipt = await Receipt.findByIdAndUpdate(
        { _id: req.params.id },
        {
            quantity,
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json(updateReceipt)
    const material = await Material.findById(receipt.materialId)
    const deleteQuantity = await Material.findByIdAndUpdate(
        { _id: material._id },
        {
            quantity: parseInt(material.quantity) - parseInt(receipt.quantity) + parseInt(updateReceipt.quantity),
        },
        {
            new: true,
            runValidators: true
        }
    )
    res.status(200).json(deleteQuantity)
})

module.exports = {
    createReceipt,
    getReceipt,
    getReceipts,
    deleteReceipt,
    updateReceipt,
    getSingleReceipt,
}