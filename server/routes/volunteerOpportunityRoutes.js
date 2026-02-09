const express = require("express");
const router = express.Router();
const {
  getAllOpportunities,
  getOpportunity,
  getOpportunitiesByNGO,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/volunteerOpportunityController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/volunteer-opportunities - Get all opportunities (Public)
router.get("/", getAllOpportunities);

// GET /api/volunteer-opportunities/ngo/:ngoId - Get opportunities by NGO
router.get("/ngo/:ngoId", getOpportunitiesByNGO);

// GET /api/volunteer-opportunities/:id - Get single opportunity
router.get("/:id", getOpportunity);

// POST /api/volunteer-opportunities - Create opportunity (NGO only)
router.post("/", protect, authorize("NGO"), createOpportunity);

// PATCH /api/volunteer-opportunities/:id - Update opportunity (NGO only)
router.patch("/:id", protect, authorize("NGO"), updateOpportunity);

// DELETE /api/volunteer-opportunities/:id - Delete opportunity
router.delete("/:id", protect, authorize("NGO", "ADMIN"), deleteOpportunity);

module.exports = router;
