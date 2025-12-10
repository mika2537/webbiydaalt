import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";

// Dynamic client uses fresh token every request
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

// ------------------------------------------------------
// 1) GET /api/courses/:course_id   → COURSE INFO
// ------------------------------------------------------
router.get("/:course_id", async (req, res) => {
  try {
    const client = lms();
    const { course_id } = req.params;

    const response = await client.get(`/courses/${course_id}`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ LMS COURSE ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to load course",
      details: err.response?.data,
    });
  }
});

// ------------------------------------------------------
// 2) GET /api/courses/:course_id/exams   → ALL EXAMS
// ------------------------------------------------------
router.get("/:course_id/exams", async (req, res) => {
  try {
    const client = lms();
    const { course_id } = req.params;

    const response = await client.get(`/courses/${course_id}/exams`);
    res.json(response.data);
  } catch (err) {
    console.error("❌ LMS EXAMS ERROR:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: "Failed to load course exams",
      details: err.response?.data,
    });
  }
});

export default router;
