const express = require("express");
const router = express.Router();

const { protect, adminOnly, productOnly } = require("../middleware/authMiddleware");
const { createMaterial, getMaterials, getMaterial, deleteMaterial, updateMaterial } = require("../controllers/materialController");
const { upload } = require("../utils/fileUpload")

router.post("/", protect, adminOnly, upload.single("image"), createMaterial)
router.get("/", protect, productOnly, getMaterials)
router.get("/:id", protect, productOnly, getMaterial)
router.delete("/:id", protect, adminOnly, deleteMaterial)
router.patch("/:id", protect, adminOnly, upload.single("image"), updateMaterial)


module.exports = router;