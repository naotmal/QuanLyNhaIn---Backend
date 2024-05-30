const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createMaterial, getMaterials, getMaterial, deleteMaterial, updateMaterial } = require("../controllers/materialController");
const { upload } = require("../utils/fileUpload")

router.post("/", protect, upload.single("image"), createMaterial)
router.get("/", protect, getMaterials)
router.get("/:id", protect, getMaterial)
router.delete("/:id", protect, deleteMaterial)
router.patch("/:id", protect, upload.single("image"), updateMaterial)


module.exports = router;