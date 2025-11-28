import * as ExamsService from "../services/exams.service.js";

export async function getAllExams(req, res) {
  res.json(await ExamsService.getAllExams());
}

export async function createExam(req, res) {
  res.json(await ExamsService.createExam(req.params.courseId, req.body));
}

export async function getExam(req, res) {
  res.json(await ExamsService.getExam(req.params.examId));
}

export async function updateExam(req, res) {
  res.json(await ExamsService.updateExam(req.params.examId, req.body));
}

export async function getExamReport(req, res) {
  res.json(await ExamsService.getExamReport(req.params.examId));
}
