const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  book: { type: String, required: true, index: true },
  stage: { type: Number, required: true, index: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswerIndex: { type: Number, required: true }
}, { timestamps: true });

questionSchema.index({ book: 1, stage: 1 });

module.exports = mongoose.model("Question", questionSchema);