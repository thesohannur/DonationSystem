const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Donor = require("../models/Donor");
const NGO = require("../models/NGO");
const Admin = require("../models/Admin");

// Generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, role, ...profileData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create the user account
    const user = await User.create({ email, password, role });

    // Create the role-specific profile
    if (role === "DONOR") {
      await Donor.create({
        email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
        occupation: profileData.occupation || "",
        userId: user._id,
      });
    } else if (role === "NGO") {
      await NGO.create({
        email,
        registrationNumber: profileData.registrationNumber,
        organizationName: profileData.organizationName,
        contactPerson: profileData.contactPerson,
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
        website: profileData.website || "",
        description: profileData.description || "",
        focusAreas: profileData.focusAreas || [],
        userId: user._id,
      });
    } else if (role === "ADMIN") {
      await Admin.create({
        email,
        fullName: profileData.fullName,
        userId: user._id,
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

module.exports = { register, login };
