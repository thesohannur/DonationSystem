const express = require("express");
const router = express.Router();
const {
  getAllVolunteers,
  getVolunteer,
  getVolunteersByDonor,
  getVolunteersByNGO,
  getVolunteersByOpportunity,
  createVolunteer,
  updateVolunteerStatus,
  deleteVolunteer,
  createTimeDonation,
} = require("../controllers/volunteerController");
const { protect, authorize } = require("../middleware/auth");

// POST /api/volunteers/time-donate - Donate time to a campaign (Donor only)
router.post("/time-donate", protect, authorize("DONOR"), createTimeDonation);

// GET /api/volunteers - Get all volunteers (Admin only)
router.get("/", protect, authorize("ADMIN"), getAllVolunteers);

// GET /api/volunteers/donor/:donorId - Get volunteers by donor
router.get("/donor/:donorId", protect, getVolunteersByDonor);

// GET /api/volunteers/ngo/:ngoId - Get volunteers by NGO
router.get("/ngo/:ngoId", protect, getVolunteersByNGO);

// GET /api/volunteers/opportunity/:opportunityId - Get volunteers by opportunity
router.get("/opportunity/:opportunityId", protect, getVolunteersByOpportunity);

// GET /api/volunteers/:id - Get single volunteer
router.get("/:id", protect, getVolunteer);

// POST /api/volunteers - Create volunteer application (Donor only)
router.post("/", protect, authorize("DONOR"), createVolunteer);

// PATCH /api/volunteers/:id - Update volunteer status (NGO or Admin)
router.patch("/:id", protect, authorize("NGO", "ADMIN"), updateVolunteerStatus);

// DELETE /api/volunteers/:id - Delete volunteer application
router.delete("/:id", protect, authorize("DONOR", "ADMIN"), deleteVolunteer);

module.exports = router;
