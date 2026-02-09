const User = require("../models/User");
const Donor = require("../models/Donor");
const NGO = require("../models/NGO");
const Admin = require("../models/Admin");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Get role-specific profile
    let profile = null;
    if (user.role === "DONOR") {
      profile = await Donor.findOne({ userId: user._id });
    } else if (user.role === "NGO") {
      profile = await NGO.findOne({ userId: user._id });
    } else if (user.role === "ADMIN") {
      profile = await Admin.findOne({ userId: user._id });
    }
    
    res.status(200).json({ success: true, data: { user, profile } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Activate/Deactivate user
// @route   PATCH /api/admin/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    // Delete role-specific profile
    if (user.role === "DONOR") {
      await Donor.findOneAndDelete({ userId: user._id });
    } else if (user.role === "NGO") {
      await NGO.findOneAndDelete({ userId: user._id });
    } else if (user.role === "ADMIN") {
      await Admin.findOneAndDelete({ userId: user._id });
    }
    
    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const totalNGOs = await NGO.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const approvedDonors = await Donor.countDocuments({ approved: true });
    const verifiedNGOs = await NGO.countDocuments({ isVerified: true });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalNGOs,
        totalAdmins,
        approvedDonors,
        verifiedNGOs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
};
