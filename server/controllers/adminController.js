const User = require("../models/User");
const Donor = require("../models/Donor");
const NGO = require("../models/NGO");
const Admin = require("../models/Admin");
const cloudinary = require("../config/cloudinary");

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    
    // Attach profile verification statuses and names
    for (let u of users) {
      if (u.role === 'DONOR') {
        const d = await Donor.findOne({ userId: u._id }).lean();
        u.isProfileApproved = d ? !!d.approved : false;
        u.name = d ? `${d.firstName} ${d.lastName}` : "Unknown Donor";
        u.profile = d || {};
      } else if (u.role === 'NGO') {
        const n = await NGO.findOne({ userId: u._id }).lean();
        u.isProfileApproved = n ? !!n.isVerified : false;
        u.name = n ? n.organizationName : "Unknown NGO";
        u.profile = n || {};
      } else {
        const a = await Admin.findOne({ userId: u._id }).lean();
        u.isProfileApproved = true; // Admins implicitly approved
        u.name = a ? a.fullName : "System Admin";
        u.profile = a || {};
      }
    }

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Unapprove a Donor/NGO profile
// @route   PATCH /api/admin/users/:id/approval
// @access  Admin
const toggleUserApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (user.role === 'DONOR') {
      await Donor.findOneAndUpdate({ userId: user._id }, { approved: isApproved });
    } else if (user.role === 'NGO') {
      await NGO.findOneAndUpdate({ userId: user._id }, { isVerified: isApproved });
    }

    res.status(200).json({
      success: true,
      message: `Profile ${isApproved ? "approved/verified" : "unapproved/unverified"}`,
    });
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

// @desc    Get current admin's profile
// @route   GET /api/admin/profile
// @access  Admin
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user.id });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin profile not found' });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update current admin's profile
// @route   PUT /api/admin/profile
// @access  Admin
const updateAdminProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const admin = await Admin.findOneAndUpdate(
      { userId: req.user.id },
      { fullName },
      { new: true, runValidators: true }
    );
    if (!admin) return res.status(404).json({ success: false, message: 'Admin profile not found' });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload/update admin profile picture
// @route   PATCH /api/admin/profile/picture
// @access  Admin
const uploadAdminProfilePicture = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string") {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    if (!image.startsWith("data:image/")) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

    const admin = await Admin.findOne({ userId: req.user.id });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin profile not found" });
    }

    if (admin.profileImagePublicId) {
      await cloudinary.uploader.destroy(admin.profileImagePublicId);
    }

    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: "donation-system/admins",
      resource_type: "image",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    admin.profileImageUrl = uploadResult.secure_url;
    admin.profileImagePublicId = uploadResult.public_id;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        profileImageUrl: admin.profileImageUrl,
        profileImagePublicId: admin.profileImagePublicId,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove admin profile picture
// @route   DELETE /api/admin/profile/picture
// @access  Admin
const removeAdminProfilePicture = async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user.id });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin profile not found" });
    }

    if (admin.profileImagePublicId) {
      await cloudinary.uploader.destroy(admin.profileImagePublicId);
    }

    admin.profileImageUrl = "";
    admin.profileImagePublicId = "";
    await admin.save();

    res.status(200).json({ success: true, message: "Profile picture removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonors = await Donor.countDocuments();
    const totalNGOs = await NGO.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    
    // Profile verified states
    const approvedDonors = await Donor.countDocuments({ approved: true });
    const verifiedNGOs = await NGO.countDocuments({ isVerified: true });
    const unapprovedDonors = await Donor.countDocuments({ approved: false });
    const unverifiedNGOs = await NGO.countDocuments({ isVerified: false });
    
    // System suspended states
    const suspendedDonorsCount = await User.countDocuments({ role: 'DONOR', isActive: false });
    const suspendedNGOsCount = await User.countDocuments({ role: 'NGO', isActive: false });
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalDonors,
        totalNGOs,
        totalAdmins,
        approvedDonors,
        verifiedNGOs,
        unapprovedDonors,
        unverifiedNGOs,
        suspendedDonors: suspendedDonorsCount,
        suspendedNGOs: suspendedNGOsCount,
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
  toggleUserApproval,
  deleteUser,
  getDashboardStats,
  getAdminProfile,
  updateAdminProfile,
  uploadAdminProfilePicture,
  removeAdminProfilePicture,
};
