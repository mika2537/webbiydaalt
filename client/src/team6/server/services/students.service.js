import * as ExamsService from "./exams.service.js";

let StudentAnswers = []; // temporary database

// LOAD STUDENT EXAM
export async function getStudentExam({ examId, studentId }) {
  let obj = StudentAnswers.find(
    (x) => x.examId === examId && x.studentId === studentId
  );

  if (!obj) {
    obj = { examId, studentId, answers: [] };
    StudentAnswers.push(obj);
  }

  return obj;
}

// SAVE STUDENT ANSWERS
export async function updateStudentExam({ examId, studentId }, data) {
  let obj = StudentAnswers.find(
    (x) => x.examId === examId && x.studentId === studentId
  );

  if (!obj) {
    obj = { examId, studentId, answers: [] };
    StudentAnswers.push(obj);
  }

  obj.answers = data.answers;
  return obj;
}

// AUTO CHECK EXAM
export async function checkExam({ examId, studentId }) {
  const exam = await ExamsService.getExam(examId);
  const questions = await ExamsService.getExamQuestions(examId);

  const student = StudentAnswers.find(
    (x) => x.examId === examId && x.studentId === studentId
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

  return { examId, studentId, correct, wrong };
}

// FINAL RESULT
export async function getResult({ examId, studentId }) {
  const exam = await ExamsService.getExam(examId);
  const questions = await ExamsService.getExamQuestions(examId);

  const { correct, wrong } = await checkExam({ examId, studentId });

  const total = questions.length;
  const score = Math.round((correct / total) * exam.totalMarks);

  const grade = score >= exam.passingMarks ? "PASS" : "FAIL";

  return {
    examId,
    studentId,
    score,
    correct,
    wrong,
    grade,
  };
}
