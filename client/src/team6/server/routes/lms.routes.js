import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";

// Helper function to get headers with current token
const getHeaders = () => ({
  Authorization: `Bearer ${process.env.LMS_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

/* ------------------------------------------
   GET /api/lms/users/:id/exams
------------------------------------------- */
router.get("/lms/users/:id/exams", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${LMS_API}/users/${id}/exams`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log("❌ LMS user exams error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

/* ------------------------------------------
   GET /api/lms/exams/:exam_id/questions
------------------------------------------- */
router.get("/lms/exams/:exam_id/questions", async (req, res) => {
  try {
    const { exam_id } = req.params;

    const response = await axios.get(`${LMS_API}/exams/${exam_id}/questions`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log(
      "❌ LMS exam questions error:",
      err.response?.data || err.message
    );
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

/* ------------------------------------------
   GET /api/lms/questions (filtered query)
------------------------------------------- */
router.get("/lms/questions", async (req, res) => {
  try {
    const response = await axios.get(`${LMS_API}/questions`, {
      headers: getHeaders(),
      params: req.query,
    });

    res.json(response.data);
  } catch (err) {
    console.log(
      "❌ LMS question filtered error:",
      err.response?.data || err.message
    );
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

/* ------------------------------------------
   GET /api/lms/questions/:id
------------------------------------------- */
router.get("/lms/questions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${LMS_API}/questions/${id}`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log(
      "❌ LMS question detail error:",
      err.response?.data || err.message
    );
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

/* ------------------------------------------
   GET /api/lms/exams/:exam_id
------------------------------------------- */
router.get("/lms/exams/:exam_id", async (req, res) => {
  try {
    const { exam_id } = req.params;

    const response = await axios.get(`${LMS_API}/exams/${exam_id}`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log("❌ LMS exam detail error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

/* ------------------------------------------
   GET /api/lms/courses/:course_id/users
------------------------------------------- */
router.get("/lms/courses/:course_id/users", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}/users`, {
      headers: getHeaders(),
    });

    res.json(response.data);
  } catch (err) {
    console.log(
      "❌ LMS course users error:",
      err.response?.data || err.message
    );
    res.status(err.response?.status || 500).json(err.response?.data || err);
  }
});

export default router;
