const LMS_API = "https://todu.mn/bs/lms/v1";

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LMS_TOKEN}`,
  };
}
export async function getAllExams() {
  try {
    const res = await fetch(`${LMS_API}/exams`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("GET ALL EXAMS ERROR:", err);
    return { items: [], error: err.message };
  }
}

let Exams = [];

export async function createExam(data) {
  const url = `${LMS_API}/courses/${data.courseId}/exams`;

  const body = {
    name: data.name,
    description: data.description || "",
    open_on: data.open_on,
    close_on: data.close_on,
    end_on: data.end_on || data.close_on,
    duration: String(data.duration || 60),
    total_point: String(data.total_point || 100),
    grade_point: String(data.grade_point || 30),
    max_attempt: String(data.max_attempt || 1),
    point_expression: data.point_expression || "",
  };

  console.log("CREATE EXAM REQUEST:", { url, body });

  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ TODU CREATE EXAM ERROR:", errorText);
    throw new Error(errorText);
  }

  const created = await res.json();

  Exams.push(created);

  return created;
}

export async function getExam(id) {
  return Exams.find((x) => x.id == id);
}

export async function updateExam(id, data) {
  const index = Exams.findIndex((x) => x.id == id);
  if (index === -1) return null;

  const body = {
    name: data.name,
    description: data.description || "",
    open_on: data.open_on,
    close_on: data.close_on,
    end_on: data.end_on || data.close_on,
    duration: String(data.duration || 60),
    total_point: String(data.total_point || 100),
    grade_point: String(data.grade_point || 30),
    max_attempt: String(data.max_attempt || 1),
    point_expression: data.point_expression || "",
  };

  console.log(" UPDATE EXAM REQUEST:", { url, body });

  const res = await fetch(url, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error(" TODU UPDATE EXAM ERROR:", errorText);
    throw new Error(errorText);
  }

  const result = await res.json();
  console.log("EXAM UPDATED:", result);
  return result;
}

export async function deleteExam(id) {
  const url = `${LMS_API}/exams/${id}`;

  console.log(" DELETE EXAM REQUEST:", { url });

  const res = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("TODU DELETE EXAM ERROR:", errorText);
    throw new Error(errorText);
  }

  console.log("EXAM DELETED:", id);
  return { success: true, id };
}

export async function getExamReport(id) {
  try {
    // Try to get exam stats from LMS
    const res = await fetch(`${LMS_API}/exams/${id}/users`, {
      headers: getHeaders(),
    });

    if (res.ok) {
      const data = await res.json();
      const users = data.items || [];
      const passed = users.filter((u) => u.passed).length;

      return {
        examId: id,
        stats: {
          total: users.length,
          passed: passed,
          failed: users.length - passed,
        },
        users: users,
      };
    }
  } catch (err) {
    console.error("GET EXAM REPORT ERROR:", err);
  }

  return {
    examId: id,
    stats: { total: 0, passed: 0, failed: 0 },
    users: [],
  };
}

let ExamQuestions = [];

export function getExamQuestions(exam_id) {
  const questions = ExamQuestions.filter((q) => q.exam_id == exam_id);
  console.log(` GET EXAM ${exam_id} QUESTIONS:`, questions);
  return questions;
}

export function addQuestionToExam(exam_id, data) {
  const newQuestion = {
    exam_id: exam_id,
    question_id: data.question_id,
    point: data.point || 10,
    priority: data.priority || 1,
  };

  ExamQuestions.push(newQuestion);
  console.log(` ADDED QUESTION ${data.question_id} TO EXAM ${exam_id}`);
  return newQuestion;
}
