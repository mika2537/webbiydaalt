import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.LMS_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

// GET /api/courses/:course_id - Get course details
router.get("/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching course:", error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

// GET /api/courses/:course_id/exams - Get course exams
router.get("/:course_id/exams", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}/exams`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching course exams:", error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

// ------------------------------
// POST /api/courses/:course_id/exams
// Create new exam for a course
// ------------------------------
router.post("/:course_id/exams", async (req, res) => {
  try {
    const { course_id } = req.params;
    const body = req.body;

    console.log("📤 CREATE EXAM:", { course_id, body });

    const response = await axios.post(
      `${LMS_API}/courses/${course_id}/exams`,
      body,
      { headers: getHeaders() }
    );

    console.log("✅ EXAM CREATED:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error creating exam:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

// ------------------------------
// GET /api/courses/:course_id/questions
// Get all questions for a course (with optional filters)
// Query params: level_id, type_id, limit, offset
// ------------------------------
router.get("/:course_id/questions", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(
      `${LMS_API}/courses/${course_id}/questions`,
      {
        headers: getHeaders(),
        params: req.query, // Pass query params like ?level_id=10&limit=100
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error fetching course questions:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

// ------------------------------
// POST /api/courses/:course_id/questions
// Create new question for a course
// ------------------------------
router.post("/:course_id/questions", async (req, res) => {
  try {
    const { course_id } = req.params;
    const body = req.body;

    console.log("📤 CREATE QUESTION:", { course_id, body });

    const response = await axios.post(
      `${LMS_API}/courses/${course_id}/questions`,
      body,
      { headers: getHeaders() }
    );

    console.log("✅ QUESTION CREATED:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error(
      "❌ Error creating question:",
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

export default router;
