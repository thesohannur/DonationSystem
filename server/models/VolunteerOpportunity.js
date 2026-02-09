const mongoose = require("mongoose");

const volunteerOpportunitySchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  maxVolunteers: {
    type: Number,
    required: [true, "Max volunteers is required"],
  },
  currentVolunteers: {
    type: Number,
    default: 0,
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("VolunteerOpportunity", volunteerOpportunitySchema);
