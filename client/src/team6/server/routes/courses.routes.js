import express from "express";
import axios from "axios";

const router = express.Router();

const LMS_API = "https://todu.mn/bs/lms/v1";
const LMS_TOKEN = process.env.LMS_TOKEN;

// GET /api/courses/:course_id - Get course details
router.get("/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;

    const response = await axios.get(`${LMS_API}/courses/${course_id}`, {
      headers: {
        Authorization: `Bearer ${LMS_TOKEN}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
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

export default router;
