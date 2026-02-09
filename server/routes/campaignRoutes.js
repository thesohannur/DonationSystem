const express = require("express");
const router = express.Router();
const {
  getAllCampaigns,
  getCampaign,
  getCampaignsByNGO,
  createCampaign,
  updateCampaign,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
  getActiveCampaigns,
  getFilteredCampaigns
} = require("../controllers/campaignController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/campaigns - Get all campaigns (Public)
router.get("/", getAllCampaigns);
router.get("/active", getActiveCampaigns);
router.get("/filter", getFilteredCampaigns);

// GET /api/campaigns/ngo/:email - Get campaigns by NGO
router.get("/ngo/:email", protect, getCampaignsByNGO);

// GET /api/campaigns/:id - Get single campaign
router.get("/:id", getCampaign);

// POST /api/campaigns - Create campaign (NGO only)
router.post("/", protect, authorize("NGO"), createCampaign);

// PATCH /api/campaigns/:id - Update campaign
router.patch("/:id", protect, authorize("NGO", "ADMIN"), updateCampaign);

// PATCH /api/campaigns/:id/approve - Approve campaign (Admin only)
router.patch("/:id/approve", protect, authorize("ADMIN"), approveCampaign);

// PATCH /api/campaigns/:id/reject - Reject campaign (Admin only)
router.patch("/:id/reject", protect, authorize("ADMIN"), rejectCampaign);

// DELETE /api/campaigns/:id - Delete campaign
router.delete("/:id", protect, authorize("NGO", "ADMIN"), deleteCampaign);

module.exports = router;
