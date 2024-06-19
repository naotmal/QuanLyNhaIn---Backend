const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema({

    token: {
        type: String,
        required: true,

    },
    createAt: {
        type: Date,
        required: true,

    },
    expiresAt: {
        type: Date,
        required: true,

    },
})

const Token = mongoose.model("Token", tokenSchema)
module.exports = Token