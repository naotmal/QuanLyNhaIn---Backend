const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createReceipt, getReceipt, deleteReceipt, updateReceipt, getReceipts, getSingleReceipt } = require("../controllers/receiptController");



router.post("/:id", protect, adminOnly, createReceipt)
router.get("/:id", protect, adminOnly, getReceipt)
router.get("/single/:id", protect, adminOnly, getSingleReceipt)
router.get("/", protect, adminOnly, getReceipts)
router.delete("/:id", protect, adminOnly, deleteReceipt)
router.patch("/:id", protect, adminOnly, updateReceipt)




module.exports = router;