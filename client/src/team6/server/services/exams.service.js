let Exams = [];

export async function getAllExams() {
  return Exams;
}

export async function createExam(courseId, data) {
  const exam = {
    id: Date.now().toString(),
    courseId,
    ...data,
  };
  Exams.push(exam);
  return exam;
}

export async function getExam(examId) {
  return Exams.find((x) => x.id === examId);
}

export async function updateExam(examId, data) {
  const index = Exams.findIndex((x) => x.id === examId);
  Exams[index] = { ...Exams[index], ...data };
  return Exams[index];
}

export async function getExamReport(examId) {
  return {
    examId,
    stats: { total, passed, failed },
  };
}
