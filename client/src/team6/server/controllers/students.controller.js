import * as StudentsService from "../services/students.service.js";

export async function getStudentExam(req, res) {
  try {
    res.json(await StudentsService.getStudentExam(req.params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateStudentExam(req, res) {
  try {
    res.json(await StudentsService.updateStudentExam(req.params, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function checkExam(req, res) {
  try {
    res.json(await StudentsService.checkExam(req.params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getResult(req, res) {
  try {
    res.json(await StudentsService.getResult(req.params));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
