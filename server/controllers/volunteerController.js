const Volunteer = require("../models/Volunteer");
const VolunteerOpportunity = require("../models/VolunteerOpportunity");
const Donor = require("../models/Donor");
const NGO = require("../models/NGO");
const Campaign = require("../models/Campaign");

// @desc    Get all volunteer applications
// @route   GET /api/volunteers
// @access  Admin
const getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find()
      .populate("donorId", "firstName lastName email")
      .populate("opportunityId", "title location")
      .populate("ngoId", "organizationName email");
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single volunteer application
// @route   GET /api/volunteers/:id
// @access  Private
const getVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id)
      .populate("donorId", "firstName lastName email phoneNumber")
      .populate("opportunityId", "title description location startDate endDate")
      .populate("ngoId", "organizationName email");
    if (!volunteer) {
      return res.status(404).json({ success: false, message: "Volunteer application not found" });
    }
    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer applications by donor
// @route   GET /api/volunteers/donor/:donorId
// @access  Private
const getVolunteersByDonor = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ donorId: req.params.donorId })
      .populate("opportunityId", "title location startDate endDate")
      .populate("ngoId", "organizationName email");
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer applications by NGO
// @route   GET /api/volunteers/ngo/:ngoId
// @access  Private
const getVolunteersByNGO = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ ngoId: req.params.ngoId })
      .populate("donorId", "firstName lastName email phoneNumber")
      .populate("opportunityId", "title location");
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer applications by opportunity
// @route   GET /api/volunteers/opportunity/:opportunityId
// @access  Private
const getVolunteersByOpportunity = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ opportunityId: req.params.opportunityId })
      .populate("donorId", "firstName lastName email phoneNumber");
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create volunteer application
// @route   POST /api/volunteers
// @access  Private (Donor only)
const createVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    
    // Increment current volunteers count
    await VolunteerOpportunity.findByIdAndUpdate(req.body.opportunityId, {
      $inc: { currentVolunteers: 1 },
    });
    
    res.status(201).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update volunteer application status
// @route   PATCH /api/volunteers/:id
// @access  Private (NGO or Admin)
const updateVolunteerStatus = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, hoursCompleted: req.body.hoursCompleted },
      { new: true }
    );
    if (!volunteer) {
      return res.status(404).json({ success: false, message: "Volunteer application not found" });
    }
    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete volunteer application
// @route   DELETE /api/volunteers/:id
// @access  Private (Donor or Admin)
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: "Volunteer application not found" });
    }
    
    // Decrement current volunteers count
    await VolunteerOpportunity.findByIdAndUpdate(volunteer.opportunityId, {
      $inc: { currentVolunteers: -1 },
    });
    
    res.status(200).json({ success: true, message: "Volunteer application deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Donate time to a campaign (auto-resolves donor & NGO from auth + campaign)
// @route   POST /api/volunteers/time-donate
// @access  Private (Donor only)
const createTimeDonation = async (req, res) => {
  try {
    const { campaignId, hoursCommitted, donorMessage } = req.body;

    if (!campaignId) {
      return res.status(400).json({ success: false, message: "campaignId is required" });
    }
    if (!hoursCommitted || hoursCommitted <= 0) {
      return res.status(400).json({ success: false, message: "Please provide valid hours to commit" });
    }

    // Resolve donor from authenticated user
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }
    if (!donor.approved) {
      return res.status(403).json({ success: false, message: "Your donor account is pending approval" });
    }

    // Validate campaign
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    if (!campaign.approved) {
      return res.status(400).json({ success: false, message: "Campaign is not approved" });
    }
    if (new Date() > campaign.expirationTime) {
      return res.status(400).json({ success: false, message: "Campaign has expired" });
    }
    if (!campaign.acceptsTime) {
      return res.status(400).json({ success: false, message: "Campaign does not accept time donations" });
    }

    // Resolve NGO
    const ngo = await NGO.findOne({ email: campaign.ngoEmail });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }

    const volunteer = await Volunteer.create({
      donorId: donor._id,
      ngoId: ngo._id,
      campaignId,
      hoursCommitted,
      donorMessage: donorMessage || "",
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllVolunteers,
  getVolunteer,
  getVolunteersByDonor,
  getVolunteersByNGO,
  getVolunteersByOpportunity,
  createVolunteer,
  updateVolunteerStatus,
  deleteVolunteer,
  createTimeDonation,
};
