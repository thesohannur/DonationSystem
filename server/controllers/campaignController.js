const Campaign = require("../models/Campaign");
const NGO = require("../models/NGO");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (image, folder) => {
  return cloudinary.uploader.upload(image, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 1200, height: 800, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
};

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

// @desc    Get current NGO campaigns
// @route   GET /api/campaigns/me
// @access  Private (NGO)
const getMyCampaigns = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const campaigns = await Campaign.find({ ngoEmail: ngo.email })
      .sort({ creationTime: -1 })
      .lean();

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
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const { image, ...campaignData } = req.body;
    campaignData.ngoEmail = ngo.email;
    campaignData.approved = false;
    campaignData.pendingCheckup = true;

    if (!campaignData.name || !String(campaignData.name).trim()) {
      return res.status(400).json({ success: false, message: "Campaign name is required." });
    }
    campaignData.name = String(campaignData.name).trim();

    if (!campaignData.expirationTime) {
      return res.status(400).json({ success: false, message: "Expiration date is required." });
    }

    const createExpirationDate = new Date(campaignData.expirationTime);
    if (Number.isNaN(createExpirationDate.getTime()) || createExpirationDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Expiration date must be in the future." });
    }
    campaignData.expirationTime = createExpirationDate;

    const acceptsMoneyFlag = campaignData.acceptsMoney === undefined
      ? true
      : campaignData.acceptsMoney === true || campaignData.acceptsMoney === "true";
    const acceptsTimeFlag = campaignData.acceptsTime === undefined
      ? false
      : campaignData.acceptsTime === true || campaignData.acceptsTime === "true";

    if (!acceptsMoneyFlag && !acceptsTimeFlag) {
      return res.status(400).json({ success: false, message: "Select at least one: accept money or accept time." });
    }

    campaignData.acceptsMoney = acceptsMoneyFlag;
    campaignData.acceptsTime = acceptsTimeFlag;
    if (!acceptsMoneyFlag) {
      campaignData.targetAmount = null;
    }

    if (image && typeof image === "string") {
      const uploadResult = await uploadImage(image, "donation-system/campaigns");
      campaignData.imageUrl = uploadResult.secure_url;
      campaignData.imagePublicId = uploadResult.public_id;
    }

    const campaign = await Campaign.create(campaignData);
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
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    if (req.user.role !== "ADMIN") {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (!ngo || ngo.email !== campaign.ngoEmail) {
        return res.status(403).json({ success: false, message: "Not authorized to modify this campaign" });
      }
    }

    const { image, ...updateData } = req.body;

    if (updateData.name !== undefined) {
      if (!String(updateData.name).trim()) {
        return res.status(400).json({ success: false, message: "Campaign name cannot be empty." });
      }
      updateData.name = String(updateData.name).trim();
    }

    const nextExpirationTime = updateData.expirationTime === undefined
      ? campaign.expirationTime
      : updateData.expirationTime;

    if (!nextExpirationTime) {
      return res.status(400).json({ success: false, message: "Expiration date is required." });
    }

    const updateExpirationDate = new Date(nextExpirationTime);
    if (Number.isNaN(updateExpirationDate.getTime()) || updateExpirationDate <= new Date()) {
      return res.status(400).json({ success: false, message: "Expiration date must be in the future." });
    }
    updateData.expirationTime = updateExpirationDate;

    const nextAcceptsMoney = updateData.acceptsMoney === undefined
      ? campaign.acceptsMoney
      : updateData.acceptsMoney === true || updateData.acceptsMoney === "true";
    const nextAcceptsTime = updateData.acceptsTime === undefined
      ? campaign.acceptsTime
      : updateData.acceptsTime === true || updateData.acceptsTime === "true";

    if (!nextAcceptsMoney && !nextAcceptsTime) {
      return res.status(400).json({ success: false, message: "Select at least one: accept money or accept time." });
    }

    updateData.acceptsMoney = nextAcceptsMoney;
    updateData.acceptsTime = nextAcceptsTime;
    if (!nextAcceptsMoney) {
      updateData.targetAmount = null;
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        campaign[key] = updateData[key];
      }
    });

    if (image !== undefined) {
      if (campaign.imagePublicId) {
        await cloudinary.uploader.destroy(campaign.imagePublicId);
      }

      if (image) {
        const uploadResult = await uploadImage(image, "donation-system/campaigns");
        campaign.imageUrl = uploadResult.secure_url;
        campaign.imagePublicId = uploadResult.public_id;
      } else {
        campaign.imageUrl = "";
        campaign.imagePublicId = "";
      }
    }

    // Any NGO-side edit must go through admin approval again.
    if (req.user.role !== "ADMIN") {
      campaign.approved = false;
      campaign.pendingCheckup = true;
      campaign.rejectFlag = 0;
    }

    const savedCampaign = await campaign.save();
    res.status(200).json({ success: true, data: savedCampaign });
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
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found" });
    }

    if (req.user.role !== "ADMIN") {
      const ngo = await NGO.findOne({ userId: req.user._id });
      if (!ngo || ngo.email !== campaign.ngoEmail) {
        return res.status(403).json({ success: false, message: "Not authorized to delete this campaign" });
      }
    }

    if (campaign.imagePublicId) {
      await cloudinary.uploader.destroy(campaign.imagePublicId);
    }

    await Campaign.findByIdAndDelete(req.params.id);
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
  getMyCampaigns,
  createCampaign,
  updateCampaign,
  approveCampaign,
  rejectCampaign,
  deleteCampaign,
  getActiveCampaigns,
  getFilteredCampaigns
};



