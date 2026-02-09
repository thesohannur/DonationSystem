const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  opportunityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VolunteerOpportunity",
    required: true,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
    default: "PENDING",
  },
  donorMessage: {
    type: String,
    default: "",
  },
  hoursCommitted: {
    type: Number,
    default: 0,
  },
  hoursCompleted: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
