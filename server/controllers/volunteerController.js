const Volunteer = require("../models/Volunteer");
const VolunteerOpportunity = require("../models/VolunteerOpportunity");

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

module.exports = {
  getAllVolunteers,
  getVolunteer,
  getVolunteersByDonor,
  getVolunteersByNGO,
  getVolunteersByOpportunity,
  createVolunteer,
  updateVolunteerStatus,
  deleteVolunteer,
};
