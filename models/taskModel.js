const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({




    name: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
    progress: {
        type: String,
        enum: ['1', '2', '3', '4'],
        default: '1'
    },
    quantity: {
        type: Number,
        trim: [true, "Please add name"],
        required: true,
    },
    price:{
        type: Number,
        trim: true,
        default: '0'
    },
    unit: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
    description: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Client",
    },
    createAt: {
        type: Date,
        required: true,

    },

}, {
    timestamps: true,
}
)

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;