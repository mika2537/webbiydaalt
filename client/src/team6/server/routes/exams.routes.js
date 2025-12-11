import { Router } from "express";
import * as ExamsController from "../controllers/exams.controller.js";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

// GET /api/exams - бүх шалгалтуудыг авах
router.get("/", ExamsController.getAllExams);

// POST /api/exams - шинэ шалгалт үүсгэх
router.post("/", ExamsController.createExam);

// GET /api/exams/:exam_id - нэг шалгалтын мэдээлэл
router.get("/:exam_id", ExamsController.getExam);

// PUT /api/exams/:exam_id - шалгалт засах
router.put("/:exam_id", ExamsController.updateExam);

// DELETE /api/exams/:exam_id - шалгалт устгах
router.delete("/:exam_id", ExamsController.deleteExam);

// GET /api/exams/:exam_id/report - шалгалтын тайлан
router.get("/:exam_id/report", ExamsController.getExamReport);

// GET /api/exams/:exam_id/stats - шалгалтын статистик
router.get("/:exam_id/stats", ExamsController.getExamStats);

// ========================================
// EXAM QUESTIONS
// ========================================

// GET /api/exams/:exam_id/questions - шалгалтын асуултууд
router.get("/:exam_id/questions", ExamsController.getExamQuestions);

// POST /api/exams/:exam_id/questions - шалгалтанд асуулт нэмэх
router.post("/:exam_id/questions", ExamsController.addQuestionToExam);

// ========================================
// EXAM VARIANTS (shortcut routes)
// ========================================

// GET /api/exams/:exam_id/variants - шалгалтын хувилбарууд
router.get("/:exam_id/variants", VariantsController.getVariants);

// POST /api/exams/:exam_id/variants - хувилбар үүсгэх
router.post("/:exam_id/variants", VariantsController.createVariant);

export default router;
