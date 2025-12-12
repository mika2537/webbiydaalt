import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";

const router = Router();

router.get("/", ExamsController.getAllExams);
router.post("/", ExamsController.createExam);
router.get("/:id", ExamsController.getExam);
router.put("/:id", ExamsController.updateExam);
router.get("/:id/report", ExamsController.getExamReport);

router.get("/:id/stats", async (req, res) => {
  try {
    const report = await ExamsController.getExamReport(req, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
