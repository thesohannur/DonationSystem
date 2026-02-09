const Payment = require("../models/Payment");
const Donor = require("../models/Donor");
const NGO = require("../models/NGO");
const Campaign = require("../models/Campaign");

// @desc    Get all payments
// @route   GET /api/payments
// @access  Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("donorId", "firstName lastName email")
      .populate("ngoId", "organizationName email");
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("donorId", "firstName lastName email")
      .populate("ngoId", "organizationName email");
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payments by donor
// @route   GET /api/payments/donor/:donorId
// @access  Private
const getPaymentsByDonor = async (req, res) => {
  try {
    const payments = await Payment.find({ donorId: req.params.donorId })
      .populate("ngoId", "organizationName email");
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payments by NGO
// @route   GET /api/payments/ngo/:ngoId
// @access  Private
const getPaymentsByNGO = async (req, res) => {
  try {
    const payments = await Payment.find({ ngoId: req.params.ngoId })
      .populate("donorId", "firstName lastName email");
    res.status(200).json({ success: true, count: payments.length, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Donor only)
const createPayment = async (req, res) => {
  try {
    const { donorId, ngoId, amount, campaignId } = req.body;

    // Create payment
    const payment = await Payment.create({
      donorId,
      ngoId,
      amount,
      status: "SUCCESS",
    });

    // Update donor's total donated
    await Donor.findByIdAndUpdate(donorId, {
      $inc: { totalDonated: amount },
    });

    // Update NGO's total received
    await NGO.findByIdAndUpdate(ngoId, {
      $inc: { totalReceived: amount },
    });

    // If payment is for a campaign, update campaign
    if (campaignId) {
      await Campaign.findByIdAndUpdate(campaignId, {
        $inc: { amount: amount },
        $push: { donations: payment._id },
      });
    }

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status
// @route   PATCH /api/payments/:id
// @access  Admin
const updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Admin
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
    res.status(200).json({ success: true, message: "Payment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPayments,
  getPayment,
  getPaymentsByDonor,
  getPaymentsByNGO,
  createPayment,
  updatePaymentStatus,
  deletePayment,
};
