require("dotenv").config();
const mongoose = require("mongoose");
const Question = require("./models/Question");
const Book = require("./models/Book");
const questionsData = require("./questions.json");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected for Migration"))
  .catch(err => console.log(err));

async function migrate() {
  try {

    // Optional: Clear existing data (only if safe)
    await Question.deleteMany({});
    await Book.deleteMany({});

    let orderCounter = 1;

    for (const bookName in questionsData) {

      let stageCount = 0;

      for (const stageKey in questionsData[bookName]) {

        stageCount++;
        const stageNumber = parseInt(stageKey.replace("stage",""));

        const stageQuestions = questionsData[bookName][stageKey];

        const formattedQuestions = stageQuestions.map(q => ({
          book: bookName,
          stage: stageNumber,
          question: q.q,
          options: q.o,
          correctAnswerIndex: q.a
        }));

        await Question.insertMany(formattedQuestions);
      }

      await Book.create({
        name: bookName,
        testament: detectTestament(bookName),
        totalStages: stageCount,
        order: orderCounter++
      });
    }

    console.log("Migration Completed Successfully 🎉");
    process.exit();

  } catch (error) {
    console.error("Migration Failed:", error);
    process.exit(1);
  }
}

function detectTestament(book) {
  const oldTestament = [
    "Genesis","Exodus","Leviticus","Numbers","Deuteronomy",
    "Joshua","Judges","Ruth","1 Samuel","2 Samuel",
    "1 Kings","2 Kings","1 Chronicles","2 Chronicles",
    "Ezra","Nehemiah","Esther","Job","Psalms",
    "Proverbs","Ecclesiastes","Song of Solomon",
    "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel",
    "Hosea","Joel","Amos","Obadiah","Jonah","Micah",
    "Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi"
  ];

  return oldTestament.includes(book)
    ? "Old Testament"
    : "New Testament";
}

migrate();