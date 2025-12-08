import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";

const router = Router();

router.get("/", ExamsController.getAllExams);
router.post("/", ExamsController.createExam);
router.get("/:exam_id", ExamsController.getExam);
router.put("/:exam_id", ExamsController.updateExam);
router.delete(
  "/:exam_id",
  ExamsController.deleteExam ||
    ((req, res) => res.status(501).json({ error: "Not implemented" }))
);
router.get("/:exam_id/report", ExamsController.getExamReport);
router.get(
  "/:exam_id/stats",
  ExamsController.getExamStats ||
    ((req, res) =>
      res.json({ totalStudents: 0, completed: 0, averageScore: 0 }))
);

export default router;
