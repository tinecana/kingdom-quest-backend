const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  testament: { 
    type: String, 
    enum: ["Old Testament", "New Testament"], 
    required: true,
    index: true
  },
  totalStages: { type: Number, default: 1 },
  isActive: { type: Boolean, default: true },
  order: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);