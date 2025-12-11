import * as ExamsService from "./exams.service.js";

// Temporary in-memory DB
let StudentAnswers = [];

// =====================================================
// LOAD STUDENT EXAM
// =====================================================
export async function getStudentExam({ exam_id, student_id }) {
  let obj = StudentAnswers.find(
    (x) => x.exam_id == exam_id && x.student_id == student_id
  );

  if (!obj) {
    obj = { exam_id, student_id, answers: [] };
    StudentAnswers.push(obj);
  }

  return obj;
}

// =====================================================
// SAVE STUDENT ANSWERS
// =====================================================
export async function updateStudentExam({ exam_id, student_id }, data) {
  let obj = StudentAnswers.find(
    (x) => x.exam_id == exam_id && x.student_id == student_id
  );

  if (!obj) {
    obj = { exam_id, student_id, answers: [] };
    StudentAnswers.push(obj);
  }

  obj.answers = data.answers;
  return obj;
}

// =====================================================
// AUTO CHECK EXAM
// =====================================================
export async function checkExam({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questionRefs = await ExamsService.getExamQuestions(exam_id);

  const student = StudentAnswers.find(
    (x) => x.exam_id == exam_id && x.student_id == student_id
  );

  if (!exam || !questionRefs || !student) {
    return { error: "Data not found" };
  }

  // Load actual question details from LMS for checking
  const LMS_API = "https://todu.mn/bs/lms/v1";
  const headers = {
    Authorization: `Bearer ${process.env.LMS_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let correct = 0;
  let wrong = 0;

  for (const ref of questionRefs) {
    try {
      // Get the actual question data from LMS
      const qRes = await fetch(`${LMS_API}/questions/${ref.question_id}`, {
        headers,
      });
      const question = await qRes.json();

      const ansObj = student.answers.find(
        (a) => a.questionId == ref.question_id
      );
      const response = ansObj?.response || [];

      // Check if answer is correct
      const correctAnswers = question.correct_answers || [];
      const isCorrect =
        response.length === correctAnswers.length &&
        correctAnswers.every((c) => response.includes(c));

      if (isCorrect) correct++;
      else wrong++;
    } catch (err) {
      console.error(`Error checking question ${ref.question_id}:`, err);
      wrong++;
    }
  }

  return { exam_id, student_id, correct, wrong };
}

// =====================================================
// FINAL RESULT
// =====================================================
export async function getResult({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questionRefs = await ExamsService.getExamQuestions(exam_id);

  const { correct, wrong } = await checkExam({ exam_id, student_id });

  const total = questionRefs.length;

  const score = Math.round((correct / total) * exam.total_point);
  const grade = score >= exam.grade_point ? "PASS" : "FAIL";

  return {
    exam_id,
    student_id,
    score,
    correct,
    wrong,
    total,
    grade,
  };
}
