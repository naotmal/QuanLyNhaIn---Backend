const mongoose = require("mongoose");

const materialSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",

    },
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true
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
    
}, {
    timestamps: true,
}
)

const Material = mongoose.model("Material", materialSchema)
module.exports = Material