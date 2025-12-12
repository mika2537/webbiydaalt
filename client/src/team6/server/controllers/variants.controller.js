import * as VariantsService from "../services/variants.service.js";

export async function getVariants(req, res) {
  try {
    const data = await VariantsService.getVariants(req.params.exam_id);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function createVariant(req, res) {
  try {
    const data = await VariantsService.createVariant(
      req.params.exam_id,
      req.body
    );
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function getVariant(req, res) {
  try {
    const data = await VariantsService.getVariant(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function updateVariant(req, res) {
  try {
    const data = await VariantsService.updateVariant(req.params.id, req.body);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function deleteVariant(req, res) {
  try {
    const data = await VariantsService.deleteVariant(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function getVariantQuestions(req, res) {
  try {
    const data = await VariantsService.getVariantQuestions(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function addQuestionToVariant(req, res) {
  try {
    const { question_id, point, priority } = req.body;
    const data = await VariantsService.addQuestionToVariant(
      req.params.id,
      question_id,
      { point, priority }
    );
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function removeQuestionFromVariant(req, res) {
  try {
    const data = await VariantsService.removeQuestionFromVariant(
      req.params.id,
      req.params.question_id
    );
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}

export async function getExamQuestions(req, res) {
  try {
    const data = await VariantsService.getExamQuestions(req.params.exam_id);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.message,
      details: error.response?.data,
    });
  }
}
