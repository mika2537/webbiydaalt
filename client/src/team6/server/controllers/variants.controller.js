import * as VariantsService from "../services/variants.service.js";

export async function getVariants(req, res) {
  res.json(await VariantsService.getVariants(req.params.exam_id));
}

export async function createVariant(req, res) {
  res.json(await VariantsService.createVariant(req.params.exam_id, req.body));
}

export async function getVariant(req, res) {
  res.json(await VariantsService.getVariant(req.params.exam_id, req.params.id));
}

export async function updateVariant(req, res) {
  res.json(
    await VariantsService.updateVariant(
      req.params.exam_id,
      req.params.id,
      req.body
    )
  );
}
