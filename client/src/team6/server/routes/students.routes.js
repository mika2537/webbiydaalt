import { Router } from "express";
import * as StudentsController from "../controllers/students.controller.js";

const router = Router();

// Student exam routes
router.get("/:exam_id/:student_id", StudentsController.getStudentExam);
router.post(
  "/:exam_id/:student_id/start",
  StudentsController.startExam ||
    ((req, res) => res.status(501).json({ error: "Not implemented" }))
);
router.put("/:exam_id/:student_id", StudentsController.updateStudentExam);
router.post(
  "/:exam_id/:student_id/submit",
  StudentsController.submitExam ||
    ((req, res) => res.status(501).json({ error: "Not implemented" }))
);
router.get("/:exam_id/:student_id/check", StudentsController.checkExam);
router.get("/:exam_id/:student_id/result", StudentsController.getResult);

export default router;
