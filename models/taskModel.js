const mongoose = require ("mongoose")
const taskSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: [true, "Please add a task"],

        },
        completed:{
            type: Boolean,
            required: true,
            default: false
        },
        sku: {
            type: String,
            required: true,
            default: "SKU",
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Please add a category"],
            trim: true,
        },
        quantity: {
            type: String,
            required: [true, "Please add a quantity"],
            trim: true,
        },
        price: {
            type: String,
            required: [true, "Please add a price"],
            trim: true,
        },
        description: {
            type: String,
            default: {}
        },
        image: {
            type: Object,
            default: {}
        },
    },
    {
        timestamps: true
    }
)

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
