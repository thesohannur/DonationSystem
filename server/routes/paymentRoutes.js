const express = require("express");
const router = express.Router();
const {
  getAllPayments,
  getPayment,
  getPaymentsByDonor,
  getPaymentsByNGO,
  createPayment,
  updatePaymentStatus,
  deletePayment,
  createDonation
} = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");

// GET /api/payments - Get all payments (Admin only)
router.get("/", protect, authorize("ADMIN"), getAllPayments);
router.post("/donate", protect, authorize("DONOR"), createDonation);

// GET /api/payments/donor/:donorId - Get payments by donor
router.get("/donor/:donorId", protect, getPaymentsByDonor);

// GET /api/payments/ngo/:ngoId - Get payments by NGO
router.get("/ngo/:ngoId", protect, getPaymentsByNGO);

// GET /api/payments/:id - Get single payment
router.get("/:id", protect, getPayment);

// POST /api/payments - Create payment (Donor only)
router.post("/", protect, authorize("DONOR"), createPayment);

// PATCH /api/payments/:id - Update payment status (Admin only)
router.patch("/:id", protect, authorize("ADMIN"), updatePaymentStatus);

// DELETE /api/payments/:id - Delete payment (Admin only)
router.delete("/:id", protect, authorize("ADMIN"), deletePayment);

module.exports = router;
