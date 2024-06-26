const express = require("express");
const router = express.Router();
const { protect, saleOnly, productOnly } = require("../middleware/authMiddleware");
const { createClient, getClients, getClient, deleteClient, updateClient,getClientSKU } = require("../controllers/clientController");


router.post("/", protect, saleOnly, createClient)
router.get("/", protect, productOnly, getClients)
router.get("/:id", protect, saleOnly, getClient)
router.delete("/:id", protect, saleOnly, deleteClient)
router.patch("/:id", protect, saleOnly, updateClient)
router.get("/client/:sku", getClientSKU)

module.exports = router