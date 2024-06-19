const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
    },
    price: {
        type: Number,
        trim: true,
        default: '0'
    },
    description: {
        type: String,
        default: {}
    },
}, {
    timestamps: true,
}
)

const Job = mongoose.model("Job", jobSchema)
module.exports = Job