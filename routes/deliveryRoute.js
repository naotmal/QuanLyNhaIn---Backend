const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createDelivery, getDelivery, deleteDelivery, updateDelivery, getDeliveries } = require("../controllers/deliveryController");


router.post("/", protect, createDelivery)
router.get("/:id", protect, getDelivery)
router.get("/", protect, getDeliveries)
router.delete("/:id", protect, deleteDelivery)
router.patch("/:id", protect, updateDelivery)

module.exports=router