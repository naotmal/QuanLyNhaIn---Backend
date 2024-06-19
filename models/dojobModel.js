const mongoose = require("mongoose");

const dojobSchema = mongoose.Schema({
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Job",
    },
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Delivery",

    },
    price: {
        type: Number,
        default: 0
    }
    
}, {
    timestamps: true,
}
)

const DoJob = mongoose.model("DoJob", dojobSchema)
module.exports = DoJob