const NGO = require("../models/NGO");
const User = require("../models/User");

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
  updateNGO,
  verifyNGO,
  deleteNGO,
};
