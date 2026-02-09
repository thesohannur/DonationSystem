const Donor = require("../models/Donor");
const User = require("../models/User");

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

// @desc    Get donor statistics
// @route   GET /api/donors/me/stats
// @access  Private (Donor)
const getDonorStats = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    // Get donation count
    const donationCount = await Payment.countDocuments({ 
      donorId: donor._id, 
      status: "SUCCESS" 
    });

    // Get unique campaigns donated to
    const donations = await Payment.find({ 
      donorId: donor._id, 
      status: "SUCCESS" 
    }).distinct("ngoId");

    const stats = {
      totalDonated: donor.totalDonated,
      donationCount: donationCount,
      campaignsSupported: donations.length,
      registrationDate: donor.registrationDate,
      approved: donor.approved,
    };

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my donation history
// @route   GET /api/donors/me/donations
// @access  Private (Donor)
const getMyDonations = async (req, res) => {
  try {
    const donor = await Donor.findOne({ userId: req.user._id });
    if (!donor) {
      return res.status(404).json({ success: false, message: "Donor not found" });
    }

    const donations = await Payment.find({ donorId: donor._id })
      .populate("ngoId", "name email")
      .sort({ timestamp: -1 });

    res.status(200).json({ 
      success: true, 
      count: donations.length, 
      data: donations 
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
  getDonorStats,
  getMyDonations
};



