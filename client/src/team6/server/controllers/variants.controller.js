import * as VariantsService from "../services/variants.service.js";

export async function createVariant(req, res) {
  res.json(await VariantsService.createVariant(req.params.examId, req.body));
}

export async function getVariant(req, res) {
  res.json(await VariantsService.getVariant(req.params.examId, req.params.id));
}

export async function updateVariant(req, res) {
  res.json(
    await VariantsService.updateVariant(
      req.params.examId,
      req.params.id,
      req.body
    )
  );
}
export async function deleteVariants(req, res) {
  res.json(
    await VariantsService.deleteVariants(req.params.examId, req.body.ids)
  );
}
