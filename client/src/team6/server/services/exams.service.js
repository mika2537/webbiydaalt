let Exams = []; // in-memory DB

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

export async function getExam(exam_id) {
  return Exams.find((x) => x.id === examId);
}

export async function updateExam(exam_id, data) {
  const index = Exams.findIndex((x) => x.id === examId);
  if (index === -1) return null;
  Exams[index] = { ...Exams[index], ...data };
  return Exams[index];
}

export async function getExamReport(exam_id) {
  return {
    examId,
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
    },
  };
}
