const express = require("express");
const router = express.Router();

const { protect, saleOnly, productOnly } = require("../middleware/authMiddleware");
const { createTask, getTasks, getTask, deleteTask, updateTask, getTaskbyClient, changeProgress } = require("../controllers/taskController");


router.post("/", protect, saleOnly, createTask);
router.get("/", protect, productOnly, getTasks);
router.get("/:clientId", protect, productOnly, getTaskbyClient);
router.get("/single/:id", protect, productOnly, getTask)
router.delete("/:id", protect, saleOnly, deleteTask)
router.patch("/:id", protect, saleOnly, updateTask)
router.post("/changeprogress", protect, productOnly, changeProgress)








module.exports = router;