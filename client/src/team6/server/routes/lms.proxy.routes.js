import express from "express";
import axios from "axios";

const router = express.Router();

// ------------------------------
// CONSTANTS
// ------------------------------
const LMS_API = "https://todu.mn/bs/lms/v1";

// ------------------------------
// SHARED AXIOS CLIENT
// Always read fresh token each request
// ------------------------------
function lms() {
  return axios.create({
    baseURL: LMS_API,
    headers: {
      Authorization: `Bearer ${process.env.LMS_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

/* ------------------------------------------------------
   BASE EXAM ROUTES
------------------------------------------------------ */

// GET /api/lms/exams/:id  → Fetch exam info
router.get("/exams/:id", async (req, res) => {
  try {
    const r = await lms().get(`/exams/${req.params.id}`);
    res.json(r.data);
  } catch (err) {
    console.error("❌ TODU ERROR (exam):", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

/* ------------------------------------------------------
   GET exam question list (student-specific)
   NEW VERSION WITH users/me ENDPOINT
------------------------------------------------------ */
router.get("/exams/:id/questions", async (req, res) => {
  try {
    const { student_id } = req.query;

    const r = await lms().get(`/users/me/exams/${req.params.id}/questions`, {
      params: { current_user: student_id },
    });

    res.json(r.data);
  } catch (err) {
    console.log("❌ GET QUESTIONS ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   PUT save one answer
   current_user SHOULD NOT BE SENT
------------------------------------------------------ */
router.put("/exams/:id/questions", async (req, res) => {
  try {
    const payload = {
      id: req.body.id,
      answer: req.body.answer,
    };

    const r = await lms().put(
      `/users/me/exams/${req.params.id}/questions`,
      payload
    );

    res.json(r.data);
  } catch (err) {
    console.log("❌ PUT ANSWER ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   SUBMIT exam
------------------------------------------------------ */
router.put("/exams/:id/submit", async (req, res) => {
  try {
    const payload = {
      current_user: req.body.student_id,
      body_text: "submit",
    };

    const r = await lms().put(`/users/me/exams/${req.params.id}`, payload);

    res.json(r.data);
  } catch (err) {
    console.log("❌ SUBMIT ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   QUESTIONS API
------------------------------------------------------ */

// GET /api/lms/questions (filter queries)
router.get("/questions", async (req, res) => {
  try {
    const r = await lms().get(`/questions`, { params: req.query });
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ QUESTIONS LIST ERROR:",
      err.response?.data || err.message
    );
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// GET /api/lms/questions/:id → Fetch one question
router.get("/questions/:id", async (req, res) => {
  try {
    const r = await lms().get(`/questions/${req.params.id}`);
    res.json(r.data);
  } catch (err) {
    console.error("❌ QUESTION ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

export default router;
