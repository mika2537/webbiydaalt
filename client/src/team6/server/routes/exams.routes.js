import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

// GET /api/exams - бүх шалгалтуудыг авах
router.get("/", ExamsController.getAllExams);

// POST /api/exams - шинэ шалгалт үүсгэх
router.post("/", ExamsController.createExam);
router.get("/:id", ExamsController.getExam);
router.put("/:id", ExamsController.updateExam);
router.get("/:id/report", ExamsController.getExamReport);

export default router;
