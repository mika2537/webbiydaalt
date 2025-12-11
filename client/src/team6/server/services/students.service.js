import * as ExamsService from "./exams.service.js";

let StudentAnswers = []; // in-memory

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

export async function updateStudentExam({ exam_id, student_id }, data) {
  let obj = StudentAnswers.find(
    (x) => x.exam_id == exam_id && x.student_id == student_id
  );
  if (!obj) {
    obj = { exam_id, student_id, answers: [] };
    StudentAnswers.push(obj);
  }

  // store in local shape: expected array of { questionId, response }
  obj.answers = data.answers || [];
  return obj;
}

export async function checkExam({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questions = await ExamsService.getExamQuestions(exam_id);

  const student = StudentAnswers.find(
    (x) => x.exam_id == exam_id && x.student_id == student_id
  );
  if (!exam || !questions || !student) {
    return { error: "Data not found" };
  }

  let correct = 0;
  let wrong = 0;
  const details = [];

  for (const q of questions) {
    // q may be lightweight; if LMS returns 'answer' or 'correctAnswers', adapt accordingly.
    const ansObj = student.answers.find((a) => a.questionId == q.id);
    const response = ansObj?.response || [];

    // If q.correctAnswers exists, use it. If not, use q.answer or empty.
    const correctAnswers = q.correctAnswers || (q.answer ? [q.answer] : []);
    const isCorrect =
      correctAnswers.length > 0
        ? response.length === correctAnswers.length &&
          correctAnswers.every((c) => response.includes(c))
        : false;

    if (isCorrect) correct++;
    else wrong++;

    details.push({
      id: q.id,
      question: q.question || q.title || "",
      studentAnswer: response,
      correctAnswers,
      isCorrect,
      point: q.point || 0,
      level_id: q.level_id || 0,
    });
  }

  return {
    exam_id,
    student_id,
    correct,
    wrong,
    details,
    exam_name: exam.name,
    total: questions.length,
  };
}

export async function getResult({ exam_id, student_id }) {
  const exam = await ExamsService.getExam(exam_id);
  const questions = await ExamsService.getExamQuestions(exam_id);
  const { correct, wrong } = await checkExam({ exam_id, student_id });

  const total = questions.length;
  const score = Math.round(
    (correct / Math.max(1, total)) * (exam.total_point || 100)
  );
  const grade = score >= (exam.grade_point || 0) ? "PASS" : "FAIL";

  return {
    exam_id,
    student_id,
    score,
    correct,
    wrong,
    grade,
    total_point: exam.total_point || 100,
  };
}
