import { Router } from "express";
import * as StudentsController from "../controllers/students.controller.js";

const router = Router();

router.get("/:exam_id/:student_id", StudentsController.getStudentExam);
router.put("/:exam_id/:student_id", StudentsController.updateStudentExam);
router.get("/:exam_id/:student_id/check", StudentsController.checkExam);
router.get("/:exam_id/:student_id/result", StudentsController.getResult);

export default router;
