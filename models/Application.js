const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scholarship",
    required: true
  },
  answers: {
    type: Object,
    default: {}
  },
  stepsAnswers: {  
    type: [Object],
    default: []
  },
  files: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Application", ApplicationSchema);

