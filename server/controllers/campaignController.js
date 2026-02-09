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

// @desc    Get campaigns with filters
// @route   GET /api/campaigns/filter
// @access  Public/Private
const getFilteredCampaigns = async (req, res) => {
  try {
    const { acceptsMoney, acceptsTime, sortBy } = req.query;
    const currentDate = new Date();

    let query = {
      approved: true,
      expirationTime: { $gt: currentDate },
    };

    if (acceptsMoney !== undefined) {
      query.acceptsMoney = acceptsMoney === 'true';
    }

    if (acceptsTime !== undefined) {
      query.acceptsTime = acceptsTime === 'true';
    }

    let sortOptions = { creationTime: -1 };
    if (sortBy === 'expiring_soon') {
      sortOptions = { expirationTime: 1 };
    } else if (sortBy === 'amount_raised') {
      sortOptions = { amount: -1 };
    }

    const campaigns = await Campaign.find(query).sort(sortOptions);

    res.status(200).json({ 
      success: true, 
      count: campaigns.length, 
      data: campaigns 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all active campaigns for donors
// @route   GET /api/campaigns/active
// @access  Public/Private
const getActiveCampaigns = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const campaigns = await Campaign.find({
      approved: true,
      expirationTime: { $gt: currentDate },
    })
      .populate("ngoEmail")
      .sort({ creationTime: -1 });

    res.status(200).json({ 
      success: true, 
      count: campaigns.length, 
      data: campaigns 
    });
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
  getActiveCampaigns,
  getFilteredCampaigns
};



