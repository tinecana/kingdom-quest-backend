// fixNumbersDirect.js

const mongoose = require("mongoose");

// ===== PUT YOUR REAL URI HERE =====
const MONGO_URI = "mongodb+srv://Kingdom-Quest:SfoundersA1B2C3.@cluster0.i9n10bo.mongodb.net/?appName=Cluster0";
// ===== CONNECT =====
mongoose.connect(MONGO_URI)
.then(() => console.log("Database connected successfully"))
.catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// ===== Schema =====
const questionSchema = new mongoose.Schema({
  book: String,
  chapter: Number,
  stage: Number,
  question: String,
  options: [String],
  answer: String
});

const Question = mongoose.model("Question", questionSchema);

// ===== FIX FUNCTION =====
async function fixBookNames() {
  try {

    const result = await Question.updateMany(
      { book: "Number" },
      { $set: { book: "Numbers" } }
    );

    console.log("Updated:", result.modifiedCount);

  } catch (err) {

    console.log("Error:", err);

  } finally {

    mongoose.disconnect();

  }
}

fixBookNames();