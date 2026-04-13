const express = require("express");
const router = express.Router();
const {
  getAllNGOs,
  getNGO,
  getNGOByUserId,
  getMyProfile,
  updateMyProfile,
  uploadMyProfilePicture,
  removeMyProfilePicture,
  getMyStats,
  getMyCampaigns,
  getMyDonations,
  getMyVolunteers,
  updateNGO,
  verifyNGO,
  deleteNGO,
} = require("../controllers/ngoController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/ngos - Get all NGOs (Public)
router.get("/", getAllNGOs);

// GET /api/ngos/user/:userId - Get NGO by userId
router.get("/user/:userId", protect, getNGOByUserId);

// GET /api/ngos/me - Current NGO profile
router.get("/me", protect, authorize("NGO"), getMyProfile);

// PATCH /api/ngos/me - Update current NGO profile
router.patch("/me", protect, authorize("NGO"), updateMyProfile);

// PATCH /api/ngos/me/profile-picture - Update NGO profile image
router.patch("/me/profile-picture", protect, authorize("NGO"), uploadMyProfilePicture);

// DELETE /api/ngos/me/profile-picture - Remove NGO profile image
router.delete("/me/profile-picture", protect, authorize("NGO"), removeMyProfilePicture);

// GET /api/ngos/me/stats - NGO dashboard stats
router.get("/me/stats", protect, authorize("NGO"), getMyStats);

// GET /api/ngos/me/campaigns - NGO campaigns
router.get("/me/campaigns", protect, authorize("NGO"), getMyCampaigns);

// GET /api/ngos/me/donations - NGO received donations
router.get("/me/donations", protect, authorize("NGO"), getMyDonations);

// GET /api/ngos/me/volunteers - NGO volunteer applications
router.get("/me/volunteers", protect, authorize("NGO"), getMyVolunteers);

// GET /api/ngos/:id - Get single NGO
router.get("/:id", getNGO);

// PATCH /api/ngos/:id - Update NGO
router.patch("/:id", protect, updateNGO);

// PATCH /api/ngos/:id/verify - Verify NGO (Admin only)
router.patch("/:id/verify", protect, authorize("ADMIN"), verifyNGO);

// DELETE /api/ngos/:id - Delete NGO (Admin only)
router.delete("/:id", protect, authorize("ADMIN"), deleteNGO);

module.exports = router;
