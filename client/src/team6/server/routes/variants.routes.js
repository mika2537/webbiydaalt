import { Router } from "express";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

router.get("/exam/:exam_id", VariantsController.getVariants);
router.post("/exam/:exam_id", VariantsController.createVariant);

router.get("/:id", VariantsController.getVariant);
router.put("/:id", VariantsController.updateVariant);
router.delete("/:id", VariantsController.deleteVariant);

router.get("/:id/questions", VariantsController.getVariantQuestions);
router.post("/:id/questions", VariantsController.addQuestionToVariant);
router.delete(
  "/:id/questions/:question_id",
  VariantsController.removeQuestionFromVariant
);

export default router;
