import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";

const router = Router();

router.get("/", ExamsController.getAllExams);
router.post("/", ExamsController.createExam);
router.get("/:examId", ExamsController.getExam);
router.put("/:examId", ExamsController.updateExam);
router.get("/:examId/report", ExamsController.getExamReport);

export default router;
