import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";
const LMS_TOKEN = "onjcxYOFcrBnZ3HYRQGbMg";

// Axios client with token
const client = axios.create({
  baseURL: LMS_API,
  headers: {
    Authorization: `Bearer ${LMS_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// ------------------------------------------------------
// GET /api/lms/exams/:id
// ------------------------------------------------------
router.get("/exams/:id", async (req, res) => {
  try {
    const response = await client.get(`/exams/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});

// ------------------------------------------------------
// GET /api/lms/exams/:id/questions
// (Question GROUPS)
// ------------------------------------------------------
router.get("/exams/:id/questions", async (req, res) => {
  try {
    const response = await client.get(`/exams/${req.params.id}/questions`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});

// ------------------------------------------------------
// GET /api/lms/questions?lesson_id=...&type_id=... etc
// (Fetch questions by filter)
// ------------------------------------------------------
router.get("/questions", async (req, res) => {
  try {
    const response = await client.get(`/questions`, { params: req.query });
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});

// ------------------------------------------------------
// GET /api/lms/questions/:id  ← ★ ADD THIS NEW ROUTE
// (Fetch ONE REAL QUESTION)
// ------------------------------------------------------
router.get("/questions/:id", async (req, res) => {
  try {
    const response = await client.get(`/questions/${req.params.id}`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.message,
      details: err.response?.data,
    });
  }
});

export default router;
