import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";
const LMS_TOKEN = "ry6qY8CF-3f0mSj47ThzzQ";

// GET /api/courses/:course_id/exams - Get all exams for a course
router.get("/:course_id/exams", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}/exams`, {
      headers: {
        Authorization: `Bearer ${LMS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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

// GET /api/courses/:course_id/users - Get all users in a course
router.get("/:course_id/users", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}/users`, {
      headers: {
        Authorization: `Bearer ${LMS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching course users:", error.message);
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
});

export default router;
