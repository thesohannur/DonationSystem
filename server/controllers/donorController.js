const Donor = require("../models/Donor");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Volunteer = require("../models/Volunteer");
const cloudinary = require("../config/cloudinary");

// @desc    Get all donors
// @route   GET /api/donors
// @access  Admin
const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().populate("userId", "email isActive");
    res.status(200).json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single donor
// @route   GET /api/donors/:id
// @access  Private
const getDonor = async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id).populate("userId", "email isActive");
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donor by userId
// @route   GET /api/donors/user/:userId
// @access  Private
const getDonorByUserId = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.params.userId }).populate("userId", "email isActive");
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update donor profile
// @route   PATCH /api/donors/:id
// @access  Private (Donor or Admin)
const updateDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve donor
// @route   PATCH /api/donors/:id/approve
// @access  Admin
const approveDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }
    res.status(200).json({ success: true, message: "Donor approved", data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete donor
// @route   DELETE /api/donors/:id
// @access  Admin
const deleteDonor = async (req, res) => {
  try {
    const donor = await Donor.findByIdAndDelete(req.params.id);
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }
    // Also delete the associated user account
    await User.findByIdAndDelete(donor.userId);
    res.status(200).json({ success: true, message: "Donor deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donor profile (current logged-in donor)
// @route   GET /api/donors/me
// @access  Private (Donor)
const getMyProfile = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id }).populate("userId", "email isActive");
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update my profile (current logged-in donor)
// @route   PATCH /api/donors/me
// @access  Private (Donor)
const updateMyProfile = async (req, res) => {
  try {
    const { phoneNumber, address, occupation } = req.body;
    
    const updateData = {};
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (occupation !== undefined) updateData.occupation = occupation;

    const donor = await Donor.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("userId", "email isActive");

    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }
    res.status(200).json({ success: true, data: donor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload/update donor profile picture
// @route   PATCH /api/donors/me/profile-picture
// @access  Private (Donor)
const uploadMyProfilePicture = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    if (donor.profileImagePublicId) {
      await cloudinary.uploader.destroy(donor.profileImagePublicId);
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "donation-system/donors",
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    donor.profileImageUrl = uploadResult.secure_url;
    donor.profileImagePublicId = uploadResult.public_id;
    await donor.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        profileImageUrl: donor.profileImageUrl,
        profileImagePublicId: donor.profileImagePublicId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove donor profile picture
// @route   DELETE /api/donors/me/profile-picture
// @access  Private (Donor)
const removeMyProfilePicture = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor profile not found" });
    }

    if (donor.profileImagePublicId) {
      await cloudinary.uploader.destroy(donor.profileImagePublicId);
    }

    donor.profileImageUrl = "";
    donor.profileImagePublicId = "";
    await donor.save();

    res.status(200).json({ success: true, message: "Profile picture removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get donor statistics
// @route   GET /api/donors/me/stats
// @access  Private (Donor)
const getDonorStats = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    // Money donation count
    const donationCount = await Payment.countDocuments({
      donorId: donor._id,
      status: "SUCCESS",
    });

    // Unique NGOs donated to
    const uniqueNgos = await Payment.find({
      donorId: donor._id,
      status: "SUCCESS",
    }).distinct("ngoId");

    // Volunteer (time) stats
    const volunteerApplications = await Volunteer.find({
      donorId: donor._id,
      campaignId: { $ne: null },
    });
    const volunteerCount = volunteerApplications.length;
    const totalHoursCommitted = volunteerApplications.reduce(
      (sum, v) => sum + (v.hoursCommitted || 0),
      0
    );
    const totalHoursCompleted = volunteerApplications.reduce(
      (sum, v) => sum + (v.hoursCompleted || 0),
      0
    );

    const stats = {
      totalDonated: donor.totalDonated,
      donationCount,
      campaignsSupported: uniqueNgos.length,
      volunteerCount,
      totalHoursCommitted,
      totalHoursCompleted,
      registrationDate: donor.registrationDate,
      approved: donor.approved,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my donation history (money + time)
// @route   GET /api/donors/me/donations
// @access  Private (Donor)
const getMyDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    // Money donations
    const payments = await Payment.find({ donorId: donor._id })
      .populate("ngoId", "organizationName email")
      .lean();

    const moneyItems = payments.map(p => ({
      ...p,
      type: "money",
      timestamp: p.timestamp || p.createdAt || p._id.getTimestamp(),
    }));

    // Time donations (volunteer applications for campaigns)
    const volunteers = await Volunteer.find({
      donorId: donor._id,
      campaignId: { $ne: null },
    })
      .populate("ngoId", "organizationName email")
      .populate("campaignId", "name description")
      .lean();

    const timeItems = volunteers.map(v => ({
      ...v,
      type: "time",
      timestamp: v.applicationDate,
    }));

    // Merge and sort by timestamp descending
    const all = [...moneyItems, ...timeItems].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json({
      success: true,
      count: all.length,
      data: all,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getAllDonors,
  getDonor,
  getDonorByUserId,
  updateDonor,
  approveDonor,
  deleteDonor,
  getMyProfile,
  updateMyProfile,
  uploadMyProfilePicture,
  removeMyProfilePicture,
  getDonorStats,
  getMyDonations
};



