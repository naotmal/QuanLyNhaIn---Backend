const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createClient, getClients, getClient, deleteClient, updateClient } = require("../controllers/clientController");


router.post("/",protect, createClient)
router.get("/", protect, getClients)
router.get("/:id", protect, getClient)
router.delete("/:id", protect, deleteClient)
router.patch("/:id", protect, updateClient)

module.exports = router