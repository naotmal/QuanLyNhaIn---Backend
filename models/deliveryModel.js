const mongoose = require("mongoose");

const deliverySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",

    },
    
    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Material",

    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Task",

    },
    
    
    
   
    quantity: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
   
    createAt:{
        type: Date,
        required: true,
    
    },
    
}, {
    timestamps: true,
}
)

const Delivery = mongoose.model("Delivery", deliverySchema)
module.exports = Delivery