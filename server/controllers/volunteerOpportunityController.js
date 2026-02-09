const VolunteerOpportunity = require("../models/VolunteerOpportunity");

// @desc    Get all volunteer opportunities
// @route   GET /api/volunteer-opportunities
// @access  Public
const getAllOpportunities = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = {};
    
    if (active) filter.active = active === "true";
    
    const opportunities = await VolunteerOpportunity.find(filter)
      .populate("ngoId", "organizationName email");
    res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single volunteer opportunity
// @route   GET /api/volunteer-opportunities/:id
// @access  Public
const getOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id)
      .populate("ngoId", "organizationName email contactPerson phoneNumber");
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get opportunities by NGO
// @route   GET /api/volunteer-opportunities/ngo/:ngoId
// @access  Public
const getOpportunitiesByNGO = async (req, res) => {
  try {
    const opportunities = await VolunteerOpportunity.find({ ngoId: req.params.ngoId });
    res.status(200).json({ success: true, count: opportunities.length, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create volunteer opportunity
// @route   POST /api/volunteer-opportunities
// @access  Private (NGO only)
const createOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.create(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update volunteer opportunity
// @route   PATCH /api/volunteer-opportunities/:id
// @access  Private (NGO only)
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete volunteer opportunity
// @route   DELETE /api/volunteer-opportunities/:id
// @access  Private (NGO or Admin)
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.status(200).json({ success: true, message: "Opportunity deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllOpportunities,
  getOpportunity,
  getOpportunitiesByNGO,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
