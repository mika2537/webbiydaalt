let StudentAnswers = [];

export async function getStudentExam({ examId, studentId }) {
  return (
    StudentAnswers.find(
      (x) => x.examId === examId && x.studentId === studentId
    ) || { examId, studentId, answers: [] }
  );
}

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

export async function checkExam({ examId, studentId }) {
  return {
    examId,
    studentId,
    correct: 18,
    wrong: 2,
  };
}

export async function getResult({ examId, studentId }) {
  return {
    examId,
    studentId,
    score: 90,
    grade: "A",
  };
}
