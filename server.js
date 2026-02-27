require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
    res.send("Kingdom Quest API Running 🚀");
});

// Player Schema
const playerSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    totalScore: { type: Number, default: 0 },
    updatedAt: { type: Date, default: Date.now }
});

const Player = mongoose.model("Player", playerSchema);

// Sync Route
app.post("/api/sync", async (req, res) => {
    try {
        const { username, totalScore } = req.body;

        if (!username) {
            return res.status(400).json({ error: "Username required" });
        }

        await Player.findOneAndUpdate(
            { username },
            { totalScore, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        res.json({ message: "Synced successfully ✅" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

const PORT = process.env.PORT || 3000;
// Leaderboard Route
app.get("/api/leaderboard", async (req, res) => {
    try {
        const topPlayers = await Player.find()
            .sort({ totalScore: -1 })
            .limit(10);

        res.json(topPlayers);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// ===== QUESTIONS ROUTE =====
const Question = require("./models/Question");

app.get("/api/questions", async (req, res) => {
    try {
        const { book, stage, limit } = req.query;

        const questionLimit = parseInt(limit) || 10;

        const questions = await Question.aggregate([
            {
                $match: {
                    book: book,
                    stage: parseInt(stage)
                }
            },
            {
                $sample: { size: questionLimit }
            }
        ]);

        res.json(questions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// ===== BOOKS ROUTE =====
const Book = require("./models/Book");

app.get("/api/questions", async (req, res) => {
    try {
        const { book, stage, limit } = req.query;

        const questionLimit = parseInt(limit) || 10;

        const questions = await Question.aggregate([
            {
                $match: {
                    book: book,
                    stage: parseInt(stage)
                }
            },
            {
                $sample: { size: questionLimit }
            }
        ]);

        res.json(questions);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
