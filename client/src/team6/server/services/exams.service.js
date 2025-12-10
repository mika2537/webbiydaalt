export async function getAllExams() {
  return Exams;
}

let Exams = []; // local memory (optional)

export async function createExam(data) {
  const url = `https://todu.mn/bs/lms/v1/courses/${data.courseId}/exams`;

  const body = {
    name: data.name,
    description: data.description,
    open_on: data.open_on,
    close_on: data.close_on,
    end_on: data.end_on,
    duration: data.duration,
    total_point: data.total_point,
    grade_point: data.grade_point,
    max_attempt: data.max_attempt,
    point_expression: data.point_expression,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LMS_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TODU CREATE EXAM ERROR:", errorText);
    throw new Error(errorText);
  }

  return await res.json();
}
export async function getExam(id) {
  return Exams.find((x) => x.id === id);
}

export async function updateExam(id, data) {
  const index = Exams.findIndex((x) => x.id === id);
  if (index === -1) return null;

  Exams[index] = { ...Exams[index], ...data };
  return Exams[index];
}

export async function getExamReport(id) {
  return {
    examId: id,
    stats: { total: 0, passed: 0, failed: 0 },
  };
}
