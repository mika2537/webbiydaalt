import { Router } from "express";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

router.get("/:examId", VariantsController.getVariants);
router.post("/:examId", VariantsController.createVariant);
router.get("/:examId/:id", VariantsController.getVariant);
router.put("/:examId/:id", VariantsController.updateVariant);

export default router;
