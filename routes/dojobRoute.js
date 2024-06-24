const express = require("express");
const router = express.Router();

const { protect, adminOnly, productOnly, saleOnly } = require("../middleware/authMiddleware");
const { createDoJob, getDoJobs, getDoJobbyDelivery, getSingleDoJob, deleteDoJob, updateDoJob, getDoJobbyTask } = require("../controllers/dojobController");

router.post("/:deliveryId", protect, saleOnly, createDoJob)
router.get("/", protect, productOnly, getDoJobs)
router.get("/:deliveryId", protect, productOnly, getDoJobbyDelivery)
router.get("/single/:id", protect, productOnly,getSingleDoJob)
router.delete("/:id", protect, saleOnly, deleteDoJob)
router.patch("/:id", protect, saleOnly, updateDoJob)
router.get("/task/:taskId", protect, productOnly, getDoJobbyTask)

module.exports = router