const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  address: {
    type: String,
    default: "",
  },
  occupation: {
    type: String,
    default: "",
  },
  totalDonated: {
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
  approved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Donor", donorSchema);
