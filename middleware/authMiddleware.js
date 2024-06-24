const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            res.status(401)
            throw new Error("Not authorized, please login")
        }
        //Verify token
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        //Get user id from token
        const user = await User.findById(verified.id).select("-password")
        if (!user) {
            res.status(401)
            throw new Error("User not found")
        }

        req.user = user
        next()
    } catch (error) {
        res.status(401)
        throw new Error("Not authorized, please login")
    }
})

const adminOnly = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.role === "Admin") {
        next()
    } else {
        res.status(401);
        // throw new Error("Not authorized as an admin")
    }
})

const saleOnly = asyncHandler(async (req, res, next) => {
    if (req.user.role === "Sale" || req.user.role === "Admin") {
        next()
    } else {
        res.status(401);
        // throw new Error("Not authorized as a Sale")
    }
})

const productOnly = asyncHandler(async (req, res, next) => {
    if (req.user.role === "Sale" || req.user.role === "Admin" || req.user.role === "Product") {
        next()
    } else {
        res.status(401);
        // throw new Error("Not authorized as a Product")
    }
})



module.exports = {
    protect,
    adminOnly,
    saleOnly,
    productOnly,
}