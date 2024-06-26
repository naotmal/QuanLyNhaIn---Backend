const mongoose = require("mongoose");

const receiptSchema = mongoose.Schema({


    materialId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Material",

    },
    


    quantity: {
        type: Number,
        required: [true, "Please add quantity"],
        trim: true,
    },
    
    createAt: {
        type: Date,
        required: true,

    },

}, {
    timestamps: true,
}
)

const Receipt = mongoose.model("Receipt", receiptSchema)
module.exports = Receipt