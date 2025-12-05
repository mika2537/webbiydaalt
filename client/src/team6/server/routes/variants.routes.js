import { Router } from "express";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

// ✔ Get all variants for one exam
router.get("/exam/:examId", VariantsController.getVariants);

// ✔ Create variant for exam
router.post("/exam/:examId", VariantsController.createVariant);

// ✔ Get one variant by ID
router.get("/:id", VariantsController.getVariant);

// ✔ Update variant by ID
router.put("/:id", VariantsController.updateVariant);

export default router;
