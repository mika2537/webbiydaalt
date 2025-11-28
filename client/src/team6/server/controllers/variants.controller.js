import * as VariantsService from "../services/variants.service.js";

export async function getVariants(req, res) {
  res.json(await VariantsService.getVariants(req.params.examId));
}

export async function createVariant(req, res) {
  res.json(await VariantsService.createVariant(req.params.examId, req.body));
}

export async function getVariant(req, res) {
  res.json(await VariantsService.getVariant(req.params.examId, req.params.id));
}

export async function updateVariant(req, res) {
  const updated = await VariantsService.updateVariant(
    req.params.examId,
    req.params.id,
    req.body
  );

  if (!updated) return res.status(404).json({ message: "Variant not found" });

  res.json(updated);
}
