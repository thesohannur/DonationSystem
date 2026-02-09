const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

// All routes require Admin role
router.use(protect, authorize("ADMIN"));

// GET /api/admin/stats - Get dashboard statistics
router.get("/stats", getDashboardStats);

// GET /api/admin/users - Get all users
router.get("/users", getAllUsers);

// GET /api/admin/users/:id - Get user by ID
router.get("/users/:id", getUserById);

// PATCH /api/admin/users/:id/status - Activate/Deactivate user
router.patch("/users/:id/status", updateUserStatus);

// DELETE /api/admin/users/:id - Delete user
router.delete("/users/:id", deleteUser);

module.exports = router;
