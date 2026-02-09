const express = require("express");
const router = express.Router();
const {
  getAllNGOs,
  getNGO,
  getNGOByUserId,
  updateNGO,
  verifyNGO,
  deleteNGO,
} = require("../controllers/ngoController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/ngos - Get all NGOs (Public)
router.get("/", getAllNGOs);

// GET /api/ngos/user/:userId - Get NGO by userId
router.get("/user/:userId", protect, getNGOByUserId);

// GET /api/ngos/:id - Get single NGO
router.get("/:id", getNGO);

// PATCH /api/ngos/:id - Update NGO
router.patch("/:id", protect, updateNGO);

// PATCH /api/ngos/:id/verify - Verify NGO (Admin only)
router.patch("/:id/verify", protect, authorize("ADMIN"), verifyNGO);

// DELETE /api/ngos/:id - Delete NGO (Admin only)
router.delete("/:id", protect, authorize("ADMIN"), deleteNGO);

module.exports = router;
