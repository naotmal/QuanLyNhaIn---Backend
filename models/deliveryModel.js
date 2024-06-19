const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({

    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Material",

    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "Task",

    },




    quantity: {
        type: Number,
        trim: [true, "Please add name"],
        required: true,
    },
    price: {
        type: Number,
        
        default: 0,
    },
    

    createAt: {
        type: Date,
        required: true,

    },

}, {
    timestamps: true,
}
)

const Delivery = mongoose.model("Delivery", deliverySchema)
module.exports = Delivery