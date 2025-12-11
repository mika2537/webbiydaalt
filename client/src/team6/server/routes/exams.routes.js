import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";

const router = Router();

router.get("/", ExamsController.getAllExams);
router.post("/", ExamsController.createExam);
router.get("/:id", ExamsController.getExam);
router.put("/:id", ExamsController.updateExam);
router.get("/:id/report", ExamsController.getExamReport);

export default router;
