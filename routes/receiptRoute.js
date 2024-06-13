const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createReceipt, getReceipt, deleteReceipt, updateReceipt, getReceipts, getSingleReceipt } = require("../controllers/receiptController");



router.post("/:id", protect, createReceipt)
router.get("/:id", protect, getReceipt)
router.get("/single/:id", protect, getSingleReceipt)
router.get("/", protect, getReceipts)
router.delete("/:id", protect, deleteReceipt)
router.patch("/:id", protect, updateReceipt)




module.exports = router;