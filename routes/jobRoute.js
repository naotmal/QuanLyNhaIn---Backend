const express = require("express");
const router = express.Router();

const { protect, adminOnly, productOnly } = require("../middleware/authMiddleware");
const { createJob, getJobs, getJob, deleteJob, updateJob } = require("../controllers/jobController");


router.post("/", protect, adminOnly,  createJob)
router.get("/", protect, productOnly,  getJobs)
router.get("/:id", protect, productOnly,  getJob)
router.delete("/:id", protect, adminOnly,  deleteJob)
router.patch("/:id", protect, adminOnly, updateJob)

module.exports = router;