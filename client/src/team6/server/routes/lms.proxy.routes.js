import express from "express";
import axios from "axios";

const router = express.Router();

// ------------------------------
// CONSTANTS
// ------------------------------
const LMS_API = "https://todu.mn/bs/lms/v1";

// ------------------------------
// DYNAMIC AXIOS CLIENT (IMPORTANT!)
// Always read fresh token each req
// ------------------------------
function lmsClient() {
  return axios.create({
    baseURL: LMS_API,
    headers: {
      Authorization: `Bearer ${process.env.LMS_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

// ------------------------------
// GET /api/lms/exams/:id
// ------------------------------
router.get("/exams/:id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/exams/${req.params.id}`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/exams/:id/questions
// ------------------------------
router.get("/exams/:id/questions", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/exams/${req.params.id}/questions`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/questions (filter queries)
// ------------------------------
router.get("/questions", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/questions`, { params: req.query });

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/questions/:id
// (Fetch ONE real question)
// ------------------------------
router.get("/questions/:id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/questions/${req.params.id}`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

export default router;
