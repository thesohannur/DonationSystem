const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  registrationNumber: {
    type: String,
    required: [true, "Registration number is required"],
  },
  organizationName: {
    type: String,
    required: [true, "Organization name is required"],
  },
  contactPerson: {
    type: String,
    required: [true, "Contact person is required"],
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  focusAreas: {
    type: [String],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  totalReceived: {
    type: Number,
    default: 0,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("NGO", ngoSchema);
