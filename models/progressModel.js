const mongoose = require("mongoose");

const progressSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",

    },
    
    
    
    
    name: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
    progress: {
        type: String,
        enum: ["Not started", "To do", "Doing", "Deliver", "Done"],
        default: "Not started",
    },
    quantity: {
        type: String,
        trim: [true, "Please add name"],
        required: true,
    },
    unit: {
        type: String,
        enum: ["Box", "Set", "Volume", "Sheet"],
        default: "Sheet",
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
    createAt:{
        type: Date,
        required: true,
    
    },
    
}, {
    timestamps: true,
}
)

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;