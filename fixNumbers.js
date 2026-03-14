// fixNumbersDirect.js

const mongoose = require("mongoose");

// ===== STEP 1: Paste your MongoDB connection string here =====
const MONGO_URI = "mongodb+srv://Kingdom-Quest:Sfounders12345..@cluster0.mongodb.net/kingdom-quest"; 
// Replace <username> and <password> with your actual credentials

// ===== STEP 2: Connect to MongoDB =====
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Database connected successfully"))
.catch(err => {
  console.error("Database connection error:", err);
  process.exit(1);
});

// ===== STEP 3: Define your Question model =====
const questionSchema = new mongoose.Schema({
  book: String,
  chapter: Number,
  stage: Number,
  question: String,
  options: [String],
  answer: String
});

const Question = mongoose.model("Question", questionSchema);

// ===== STEP 4: Update all "Number" entries to "Numbers" =====
async function fixBookNames() {
  try {
    const result = await Question.updateMany(
      { book: "Number" },
      { $set: { book: "Numbers" } }
    );
    console.log(`Updated ${result.modifiedCount} documents from 'Number' to 'Numbers'`);
  } catch (err) {
    console.error("Error updating documents:", err);
  } finally {
    mongoose.disconnect();
  }
}

fixBookNames();