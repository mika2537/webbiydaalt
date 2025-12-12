import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";

const router = Router();

// GET /api/exams - Get all exams
router.get("/", ExamsController.getAllExams);

// POST /api/exams - Create new exam
router.post("/", ExamsController.createExam);

// GET /api/exams/:id - Get exam by ID
router.get("/:id", ExamsController.getExam);

// PUT /api/exams/:id - Update exam
router.put("/:id", ExamsController.updateExam);

// GET /api/exams/:id/report - Get exam report
router.get("/:id/report", ExamsController.getExamReport);

// GET /api/exams/:id/stats - Get exam stats
router.get("/:id/stats", async (req, res) => {
  try {
    const report = await ExamsController.getExamReport(req, res);
    // Stats are included in report
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/exams/:exam_id/variants - Get exam variants (proxy to variants service)
router.get("/:exam_id/variants", async (req, res) => {
  try {
    const axios = (await import("axios")).default;
    const LMS_API = "https://todu.mn/bs/lms/v1";

    const response = await axios.get(
      `${LMS_API}/exams/${req.params.exam_id}/variants`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LMS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ GET VARIANTS ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

// GET /api/exams/:exam_id/students - Get exam students
router.get("/:exam_id/students", async (req, res) => {
  try {
    const axios = (await import("axios")).default;
    const LMS_API = "https://todu.mn/bs/lms/v1";

    const response = await axios.get(
      `${LMS_API}/exams/${req.params.exam_id}/users`,
      {
        headers: {
          Authorization: `Bearer ${process.env.LMS_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    res.json(response.data?.items || []);
  } catch (err) {
    console.error("❌ GET STUDENTS ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/exams/:exam_id/questions - Add question to exam
router.post("/:exam_id/questions", async (req, res) => {
  try {
    const ExamsService = await import("../services/exams.service.js");
    const result = ExamsService.addQuestionToExam(req.params.exam_id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
