const NGO = require("../models/NGO");
const User = require("../models/User");
const Campaign = require("../models/Campaign");
const Payment = require("../models/Payment");
const Volunteer = require("../models/Volunteer");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (image, folder) => {
  return cloudinary.uploader.upload(image, {
    folder,
    resource_type: "image",
    transformation: [
      { width: 900, height: 900, crop: "limit" },
      { quality: "auto", fetch_format: "auto" },
    ],
  });
};

// @desc    Get all NGOs
// @route   GET /api/ngos
// @access  Public
const getAllNGOs = async (req, res) => {
  try {
    const { isVerified } = req.query;
    const filter = isVerified ? { isVerified: isVerified === "true" } : {};
    const ngos = await NGO.find(filter).populate("userId", "email isActive");
    res.status(200).json({ success: true, count: ngos.length, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single NGO
// @route   GET /api/ngos/:id
// @access  Public
const getNGO = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id).populate("userId", "email isActive");
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }
    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get NGO by userId
// @route   GET /api/ngos/user/:userId
// @access  Private
const getNGOByUserId = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.params.userId }).populate("userId", "email isActive");
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }
    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my NGO profile
// @route   GET /api/ngos/me
// @access  Private (NGO)
const getMyProfile = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id }).populate("userId", "email isActive");
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }
    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update my NGO profile
// @route   PATCH /api/ngos/me
// @access  Private (NGO)
const updateMyProfile = async (req, res) => {
  try {
    const updateData = {};
    const allowedFields = [
      "organizationName",
      "contactPerson",
      "phoneNumber",
      "address",
      "website",
      "description",
      "focusAreas",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const ngo = await NGO.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "email isActive");

    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload/update NGO profile picture
// @route   PATCH /api/ngos/me/profile-picture
// @access  Private (NGO)
const uploadMyProfilePicture = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, message: "Image is required" });
    }
    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    if (ngo.profileImagePublicId) {
      await cloudinary.uploader.destroy(ngo.profileImagePublicId);
    }

    const uploadResult = await uploadImage(image, "donation-system/ngos");
    ngo.profileImageUrl = uploadResult.secure_url;
    ngo.profileImagePublicId = uploadResult.public_id;
    await ngo.save();

    res.status(200).json({
      success: true,
      message: "NGO profile picture updated successfully",
      data: {
        profileImageUrl: ngo.profileImageUrl,
        profileImagePublicId: ngo.profileImagePublicId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove NGO profile picture
// @route   DELETE /api/ngos/me/profile-picture
// @access  Private (NGO)
const removeMyProfilePicture = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    if (ngo.profileImagePublicId) {
      await cloudinary.uploader.destroy(ngo.profileImagePublicId);
    }

    ngo.profileImageUrl = "";
    ngo.profileImagePublicId = "";
    await ngo.save();

    res.status(200).json({ success: true, message: "NGO profile picture removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my NGO stats
// @route   GET /api/ngos/me/stats
// @access  Private (NGO)
const getMyStats = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const campaigns = await Campaign.find({ ngoEmail: ngo.email }).lean();
    const donations = await Payment.find({ ngoId: ngo._id, status: "SUCCESS" }).lean();
    const volunteerApplications = await Volunteer.find({ ngoId: ngo._id, campaignId: { $ne: null } }).lean();

    const computedTotalReceived = donations.reduce(
      (sum, donation) => sum + (Number(donation.amount) || 0),
      0
    );

    const totalVolunteerHours = volunteerApplications.reduce(
      (sum, item) => sum + (item.hoursCommitted || 0),
      0
    );

    res.status(200).json({
      success: true,
      data: {
        organizationName: ngo.organizationName,
        email: ngo.email,
        isVerified: ngo.isVerified,
        totalReceived: computedTotalReceived || ngo.totalReceived || 0,
        campaignCount: campaigns.length,
        approvedCampaigns: campaigns.filter((item) => item.approved).length,
        pendingCampaigns: campaigns.filter((item) => !item.approved).length,
        donationCount: donations.length,
        volunteerApplications: volunteerApplications.length,
        totalVolunteerHours,
        registrationDate: ngo.registrationDate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my campaigns
// @route   GET /api/ngos/me/campaigns
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

// @desc    Get my received donations
// @route   GET /api/ngos/me/donations
// @access  Private (NGO)
const getMyDonations = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const donations = await Payment.find({ ngoId: ngo._id, status: "SUCCESS" })
      .populate("donorId", "firstName lastName email")
      .sort({ timestamp: -1 })
      .lean();

    res.status(200).json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my volunteer applications
// @route   GET /api/ngos/me/volunteers
// @access  Private (NGO)
const getMyVolunteers = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ userId: req.user._id });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO profile not found" });
    }

    const volunteers = await Volunteer.find({ ngoId: ngo._id, campaignId: { $ne: null } })
      .populate("donorId", "firstName lastName email phoneNumber")
      .populate("campaignId", "description expirationTime acceptsMoney acceptsTime")
      .sort({ applicationDate: -1 })
      .lean();

    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update NGO profile
// @route   PATCH /api/ngos/:id
// @access  Private (NGO or Admin)
const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }
    res.status(200).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify NGO
// @route   PATCH /api/ngos/:id/verify
// @access  Admin
const verifyNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }
    res.status(200).json({ success: true, message: "NGO verified", data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete NGO
// @route   DELETE /api/ngos/:id
// @access  Admin
const deleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.findByIdAndDelete(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, message: "NGO not found" });
    }
    // Also delete the associated user account
    await User.findByIdAndDelete(ngo.userId);
    res.status(200).json({ success: true, message: "NGO deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};
