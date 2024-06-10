const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { createTask, getTasks, getTask, deleteTask, updateTask } = require("../controllers/taskController");


router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTask)
router.delete("/:id", protect, deleteTask)
router.patch("/:id", protect, updateTask)






module.exports = router;