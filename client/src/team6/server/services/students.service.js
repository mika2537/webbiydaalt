import * as ExamsService from "./exams.service.js";

let StudentAnswers = []; // temporary database

// LOAD STUDENT EXAM
export async function getStudentExam({ exam_id, student_id }) {
  let obj = StudentAnswers.find(
    (x) => x.exam_id === exam_id && x.student_id === student_id
  );

  if (!obj) {
    obj = { exam_id, student_id, answers: [] };
    StudentAnswers.push(obj);
  }

  return obj;
}

// SAVE STUDENT ANSWERS
export async function updateStudentExam({ exam_id, student_id }, data) {
  let obj = StudentAnswers.find(
    (x) => x.exam_id === exam_id && x.student_id === student_id
  );

  if (!obj) {
    obj = { exam_id, student_id, answers: [] };
    StudentAnswers.push(obj);
  }

  obj.answers = data.answers;
  return obj;
}

// AUTO CHECK EXAM
export async function checkExam({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questions = await ExamsService.getExamQuestions(exam_id);

  const student = StudentAnswers.find(
    (x) => x.exam_id === exam_id && x.student_id === student_id
  );

  if (!exam || !questions || !student) {
    return { error: "Data not found" };
  }

  let correct = 0;
  let wrong = 0;

  for (const q of questions) {
    const ansObj = student.answers.find((a) => a.questionId === q.id);
    const response = ansObj?.response || [];

    const isCorrect =
      response.length === q.correctAnswers.length &&
      q.correctAnswers.every((c) => response.includes(c));

    if (isCorrect) correct++;
    else wrong++;
  }

  return { exam_id, student_id, correct, wrong };
}

// FINAL RESULT
export async function getResult({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questions = await ExamsService.getExamQuestions(exam_id);

  const { correct, wrong } = await checkExam({ exam_id, student_id });

  const total = questions.length;
  const score = Math.round((correct / total) * exam.totalMarks);

  const grade = score >= exam.passingMarks ? "PASS" : "FAIL";

  return {
    exam_id,
    student_id,
    score,
    correct,
    wrong,
    grade,
  };
}
