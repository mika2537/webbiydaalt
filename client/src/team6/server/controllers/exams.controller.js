import * as ExamsService from "../services/exams.service.js";

export async function getAllExams(req, res) {
  try {
    res.json(await ExamsService.getAllExams());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function createExam(req, res) {
  try {
    res.json(await ExamsService.createExam(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getExam(req, res) {
  try {
    res.json(await ExamsService.getExam(req.params.exam_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateExam(req, res) {
  try {
    res.json(await ExamsService.updateExam(req.params.exam_id, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteExam(req, res) {
  try {
    res.json(await ExamsService.deleteExam(req.params.exam_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getExamReport(req, res) {
  try {
    res.json(await ExamsService.getExamReport(req.params.exam_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getExamStats(req, res) {
  try {
    const report = await ExamsService.getExamReport(req.params.exam_id);
    res.json(report.stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getExamQuestions(req, res) {
  try {
    res.json(await ExamsService.getExamQuestions(req.params.exam_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addQuestionToExam(req, res) {
  try {
    res.json(
      await ExamsService.addQuestionToExam(req.params.exam_id, req.body)
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
