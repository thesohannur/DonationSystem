const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: false,
    default: null,
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
