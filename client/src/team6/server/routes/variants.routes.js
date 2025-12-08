import { Router } from "express";
import * as VariantsController from "../controllers/variants.controller.js";

const router = Router();

// Get all variants for one exam
router.get("/exam/:exam_id", VariantsController.getVariants);

// Create variant for exam
router.post("/exam/:exam_id", VariantsController.createVariant);

// Get one variant by ID
router.get("/:id", VariantsController.getVariant);

// Update variant by ID
router.put("/:id", VariantsController.updateVariant);

// Delete variant by ID
router.delete(
  "/:id",
  VariantsController.deleteVariant ||
    ((req, res) => res.status(501).json({ error: "Not implemented" }))
);

export default router;
