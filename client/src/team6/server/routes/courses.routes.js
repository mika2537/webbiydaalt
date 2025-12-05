import { Router } from "express";
import axios from "axios";

const router = Router();

// GET course info from LMS
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;

  try {
    const response = await axios.get(
      `https://todu.mn/bs/lms/v1/courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LMS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Course Error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to load course",
      details: err.response?.data || err.message,
    });
  }
});

export default router;
