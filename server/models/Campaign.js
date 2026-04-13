const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  ngoEmail: {
    type: String,
    required: [true, "NGO email is required"],
  },
  creationTime: {
    type: Date,
    default: Date.now,
  },
  expirationTime: {
    type: Date,
    default: null, // null = no expiration (runs indefinitely)
  },
  targetAmount: {
    type: Number,
    default: null, // null = no target set
  },
  amount: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  imageUrl: {
    type: String,
    default: "",
  },
  imagePublicId: {
    type: String,
    default: "",
  },
  manualDeletionAllowed: {
    type: Boolean,
    default: false,
  },
  rejectFlag: {
    type: Number,
    default: 0,
  },
  pendingCheckup: {
    type: Boolean,
    default: false,
  },
  donations: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Payment",
    default: [],
  },
  acceptsMoney: {
    type: Boolean,
    default: true,
  },
  acceptsTime: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Campaign", campaignSchema);
