import { Router } from "express";
import * as StudentsController from "../controllers/students.controller.js";

const router = Router();

router.get("/:examId/:studentId", StudentsController.getStudentExam);
router.put("/:examId/:studentId", StudentsController.updateStudentExam);
router.get("/:examId/:studentId/check", StudentsController.checkExam);
router.get("/:examId/:studentId/result", StudentsController.getResult);

export default router;
