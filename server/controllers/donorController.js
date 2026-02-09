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

module.exports = {
  getAllDonors,
  getDonor,
  getDonorByUserId,
  updateDonor,
  approveDonor,
  deleteDonor,
};
