const express = require("express");
const router = express.Router();
const lot = require("../controllers/lot.controller");

// Create a new lot
router.post("/lotinfo",lot.createLotInfo);

// // Get all lots
router.get("/",lot.getAllLots);
router.get('/lotByDateRange',lot.getLotsByDateRange)

// // Update a lot by ID
// router.put("/lotinfo/:id", updateLotInfo);

// // Delete a lot by ID
// router.delete("/lotinfo/:id", deleteLotInfo);

module.exports = router;
