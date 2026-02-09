const express = require("express");
const router = express.Router();
const {
  getAllDonors,
  getDonor,
  getDonorByUserId,
  updateDonor,
  approveDonor,
  deleteDonor,
} = require("../controllers/donorController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/donors - Get all donors (Admin only)
router.get("/", protect, authorize("ADMIN"), getAllDonors);

// GET /api/donors/user/:userId - Get donor by userId
router.get("/user/:userId", protect, getDonorByUserId);

// GET /api/donors/:id - Get single donor
router.get("/:id", protect, getDonor);

// PATCH /api/donors/:id - Update donor
router.patch("/:id", protect, updateDonor);

// PATCH /api/donors/:id/approve - Approve donor (Admin only)
router.patch("/:id/approve", protect, authorize("ADMIN"), approveDonor);

// DELETE /api/donors/:id - Delete donor (Admin only)
router.delete("/:id", protect, authorize("ADMIN"), deleteDonor);

module.exports = router;
