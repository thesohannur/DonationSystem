const Campaign = require("../models/Campaign");

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
const getAllCampaigns = async (req, res) => {
  try {
    const { approved, active } = req.query;
    const filter = {};
    
    if (approved) filter.approved = approved === "true";
    if (active) {
      filter.expirationTime = { $gt: new Date() };
    }
    
    const campaigns = await Campaign.find(filter).populate("donations");
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single campaign
// @route   GET /api/campaigns/:id
// @access  Public
const getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("donations");
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get campaigns by NGO email
// @route   GET /api/campaigns/ngo/:email
// @access  Private
const getCampaignsByNGO = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ ngoEmail: req.params.email }).populate("donations");
    res.status(200).json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create campaign
// @route   POST /api/campaigns
// @access  Private (NGO only)
const createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create(req.body);
    res.status(201).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update campaign
// @route   PATCH /api/campaigns/:id
// @access  Private (NGO or Admin)
const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve campaign
// @route   PATCH /api/campaigns/:id/approve
// @access  Admin
const approveCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { approved: true, pendingCheckup: false },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, message: "Campaign approved", data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject campaign
// @route   PATCH /api/campaigns/:id/reject
// @access  Admin
const rejectCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { approved: false, rejectFlag: 1, pendingCheckup: false },
      { new: true }
    );
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, message: "Campaign rejected", data: campaign });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (NGO or Admin)
const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }
    res.status(200).json({ success: true, message: "Campaign deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaign,
  getCampaignsByNGO,
  createCampaign,
  updateCampaign,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
};
