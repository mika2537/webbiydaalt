import * as StudentsService from "../services/students.service.js";

export async function getStudentExam(req, res) {
  res.json(await StudentsService.getStudentExam(req.params));
}

export async function updateStudentExam(req, res) {
  res.json(await StudentsService.updateStudentExam(req.params, req.body));
}

export async function checkExam(req, res) {
  res.json(await StudentsService.checkExam(req.params));
}

export async function getResult(req, res) {
  res.json(await StudentsService.getResult(req.params));
}
