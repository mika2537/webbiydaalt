import { Router } from "express";
import axios from "axios";

const router = Router();

router.get("/courses/:courseId/exams", async (req, res) => {
  try {
    const { courseId } = req.params;

    const response = await axios.get(
      `https://todu.mn/bs/lms/v1/courses/${courseId}/exams`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LMS_TOKEN}`,
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("LMS Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to load LMS exams" });
  }
});

export default router;
