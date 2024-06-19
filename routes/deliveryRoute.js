const express = require("express");
const router = express.Router();

const { protect, productOnly } = require("../middleware/authMiddleware");
const { createDelivery, deleteDelivery, updateDelivery, getDeliveries, getDeliverybyMaterial, getDeliverybyTask, getSingleDelivery } = require("../controllers/deliveryController");


router.post("/:taskId", protect, productOnly, createDelivery)
router.get("/material/:materialId", protect, productOnly, getDeliverybyMaterial)
router.get("/task/:taskId", protect, productOnly, getDeliverybyTask)
router.get("/", protect, productOnly, getDeliveries)
router.get("/:id", protect, productOnly, getSingleDelivery)
router.delete("/:id", protect, productOnly, deleteDelivery)
router.patch("/:id", protect, productOnly, updateDelivery)

module.exports = router