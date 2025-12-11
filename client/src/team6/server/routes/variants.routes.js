import { Router } from "express";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

// ========================================
// EXAM VARIANTS
// ========================================

// GET /api/variants/exam/:exam_id - Get all variants for one exam
router.get("/exam/:exam_id", VariantsController.getVariants);

// POST /api/variants/exam/:exam_id - Create variant for exam
router.post("/exam/:exam_id", VariantsController.createVariant);

// ========================================
// SINGLE VARIANT OPERATIONS
// ========================================

// GET /api/variants/:id - Get one variant by ID
router.get("/:id", VariantsController.getVariant);

// PUT /api/variants/:id - Update variant by ID
router.put("/:id", VariantsController.updateVariant);

// DELETE /api/variants/:id - Delete variant by ID
router.delete("/:id", VariantsController.deleteVariant);

// ========================================
// VARIANT QUESTIONS
// ========================================

// GET /api/variants/:id/questions - Get variant questions
router.get("/:id/questions", VariantsController.getVariantQuestions);

// POST /api/variants/:id/questions - Add question to variant
router.post("/:id/questions", VariantsController.addQuestionToVariant);

// DELETE /api/variants/:id/questions/:question_id - Remove question from variant
router.delete(
  "/:id/questions/:question_id",
  VariantsController.removeQuestionFromVariant
);

export default router;
