import * as ExamsService from "../services/exams.service.js";

export async function getAllExams(req, res) {
  res.json(await ExamsService.getAllExams());
}

export async function createExam(req, res) {
  try {
    const exam = await ExamsService.createExam(req.body);
    res.json(exam);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getExam(req, res) {
  const exam = await ExamsService.getExam(req.params.id);
  res.json(exam);
}

export async function updateExam(req, res) {
  const result = await ExamsService.updateExam(req.params.id, req.body);
  res.json(result);
}

export async function getExamReport(req, res) {
  const report = await ExamsService.getExamReport(req.params.id);
  res.json(report);
}
