const express = require("express");
const router = express.Router();
const { protect, saleOnly, productOnly } = require("../middleware/authMiddleware");
const { createClient, getClients, getClient, deleteClient, updateClient } = require("../controllers/clientController");


router.post("/", protect, saleOnly, createClient)
router.get("/", protect, productOnly, getClients)
router.get("/:id", protect, saleOnly, getClient)
router.delete("/:id", protect, saleOnly, deleteClient)
router.patch("/:id", protect, saleOnly, updateClient)

module.exports = router