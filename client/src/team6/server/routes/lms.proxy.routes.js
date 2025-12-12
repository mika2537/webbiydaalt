import express from "express";
import axios from "axios";

const router = express.Router();

// ------------------------------
// CONSTANTS
// ------------------------------
const LMS_API = "https://todu.mn/bs/lms/v1";

// ------------------------------
// SHARED AXIOS CLIENT
// Always read fresh token each request
// ------------------------------
function lms() {
  return axios.create({
    baseURL: LMS_API,
    headers: {
      Authorization: `Bearer ${process.env.LMS_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

/* ------------------------------------------------------
   BASE EXAM ROUTES
------------------------------------------------------ */

// GET /api/lms/exams/:id  → Fetch exam info
router.get("/exams/:id", async (req, res) => {
  try {
    const r = await lms().get(`/exams/${req.params.id}`);
    res.json(r.data);
  } catch (err) {
    console.error("❌ TODU ERROR (exam):", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

/* ------------------------------------------------------
   GET exam question list (student-specific)
   NEW VERSION WITH users/me ENDPOINT
------------------------------------------------------ */
router.get("/exams/:id/questions", async (req, res) => {
  try {
    const { student_id } = req.query;

    const r = await lms().get(`/users/me/exams/${req.params.id}/questions`, {
      params: { current_user: student_id },
    });

    res.json(r.data);
  } catch (err) {
    console.log("❌ GET QUESTIONS ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   PUT save one answer
   current_user SHOULD NOT BE SENT
------------------------------------------------------ */
router.put("/exams/:id/questions", async (req, res) => {
  try {
    const payload = {
      id: req.body.id,
      answer: req.body.answer,
    };

    const r = await lms().put(
      `/users/me/exams/${req.params.id}/questions`,
      payload
    );

    res.json(r.data);
  } catch (err) {
    console.log("❌ PUT ANSWER ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   SUBMIT exam
------------------------------------------------------ */
router.put("/exams/:id/submit", async (req, res) => {
  try {
    const payload = {
      current_user: req.body.student_id,
      body_text: "submit",
    };

    const r = await lms().put(`/users/me/exams/${req.params.id}`, payload);

    res.json(r.data);
  } catch (err) {
    console.log("❌ SUBMIT ERROR:", err.response?.data);
    res.status(err.response?.status || 500).json(err.response?.data);
  }
});

/* ------------------------------------------------------
   QUESTIONS API
------------------------------------------------------ */

// GET /api/lms/questions (filter queries)
router.get("/questions", async (req, res) => {
  try {
    const r = await lms().get(`/questions`, { params: req.query });
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ QUESTIONS LIST ERROR:",
      err.response?.data || err.message
    );
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// GET /api/lms/questions/:id → Fetch one question
router.get("/questions/:id", async (req, res) => {
  try {
    const r = await lms().get(`/questions/${req.params.id}`);
    res.json(r.data);
  } catch (err) {
    console.error("❌ QUESTION ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/users/:id/exams
// (Get all exams for a student)
// ------------------------------
router.get("/users/:id/exams", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/users/${req.params.id}/exams`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// POST /api/lms/users/me/exams/:exam_id
// (Start exam - submit answers)
// ------------------------------
router.post("/users/me/exams/:exam_id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.post(
      `/users/me/exams/${req.params.exam_id}`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU POST ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// PUT /api/lms/users/me/exams/:exam_id
// (Submit/Update exam answers)
// ------------------------------
router.put("/users/me/exams/:exam_id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.put(
      `/users/me/exams/${req.params.exam_id}`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU PUT ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// PUT /api/lms/users/me/exams/:exam_id/questions
// (Submit exam question answers)
// ------------------------------
router.put("/users/me/exams/:exam_id/questions", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.put(
      `/users/me/exams/${req.params.exam_id}/questions`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU PUT ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// POST /api/lms/courses/:course_id/exams
// (Create new exam)
// ------------------------------
router.post("/courses/:course_id/exams", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.post(
      `/courses/${req.params.course_id}/exams`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "❌ TODU CREATE EXAM ERROR:",
      err.response?.data || err.message
    );
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/courses/:course_id/questions
// (Get all questions for a course - filter by level)
// ------------------------------
router.get("/courses/:course_id/questions", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(
      `/courses/${req.params.course_id}/questions`,
      { params: req.query } // Pass query params like ?level_id=1
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// POST /api/lms/courses/:course_id/questions
// (Create new question for a course)
// ------------------------------
router.post("/courses/:course_id/questions", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.post(
      `/courses/${req.params.course_id}/questions`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error(
      "❌ TODU CREATE QUESTION ERROR:",
      err.response?.data || err.message
    );
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/exams/:exam_id/users
// (Get all users/students for an exam)
// ------------------------------
router.get("/exams/:exam_id/users", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/exams/${req.params.exam_id}/users`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/exams/:exam_id/users/:user_id
// (Get specific user exam info)
// ------------------------------
router.get("/exams/:exam_id/users/:user_id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(
      `/exams/${req.params.exam_id}/users/${req.params.user_id}`
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// POST /api/lms/exams/:exam_id/users/:user_id
// (Assign user to exam / Start exam attempt)
// ------------------------------
router.post("/exams/:exam_id/users/:user_id", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.post(
      `/exams/${req.params.exam_id}/users/${req.params.user_id}`,
      req.body
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU POST ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/exams/:exam_id/users/:user_id/attempts
// (Get all attempts for a user)
// ------------------------------
router.get("/exams/:exam_id/users/:user_id/attempts", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(
      `/exams/${req.params.exam_id}/users/${req.params.user_id}/attempts`
    );

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/exams/:exam_id/users/:user_id/attempts/:attempt
// (Get specific attempt)
// ------------------------------
router.get(
  "/exams/:exam_id/users/:user_id/attempts/:attempt",
  async (req, res) => {
    try {
      const client = lmsClient();
      const response = await client.get(
        `/exams/${req.params.exam_id}/users/${req.params.user_id}/attempts/${req.params.attempt}`
      );

      res.json(response.data);
    } catch (err) {
      console.error("❌ TODU ERROR:", err.response?.data || err.message);
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { error: err.message });
    }
  }
);

// ------------------------------
// GET /api/lms/exams/:exam_id/users/:user_id/attempts/:attempt/evaluation
// (Get attempt evaluation/results)
// ------------------------------
router.get(
  "/exams/:exam_id/users/:user_id/attempts/:attempt/evaluation",
  async (req, res) => {
    try {
      const client = lmsClient();
      const response = await client.get(
        `/exams/${req.params.exam_id}/users/${req.params.user_id}/attempts/${req.params.attempt}/evaluation`
      );

      res.json(response.data);
    } catch (err) {
      console.error("❌ TODU ERROR:", err.response?.data || err.message);
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { error: err.message });
    }
  }
);

// ------------------------------
// GET /api/lms/exams/:exam_id/users/:user_id/attempts/:attempt/questions
// (Get attempt questions with answers)
// ------------------------------
router.get(
  "/exams/:exam_id/users/:user_id/attempts/:attempt/questions",
  async (req, res) => {
    try {
      const client = lmsClient();
      const response = await client.get(
        `/exams/${req.params.exam_id}/users/${req.params.user_id}/attempts/${req.params.attempt}/questions`
      );

      res.json(response.data);
    } catch (err) {
      console.error("❌ TODU ERROR:", err.response?.data || err.message);
      res
        .status(err.response?.status || 500)
        .json(err.response?.data || { error: err.message });
    }
  }
);

// ------------------------------
// GET /api/lms/exams/:exam_id/variants
// (Get all variants for an exam)
// ------------------------------
router.get("/exams/:exam_id/variants", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/exams/${req.params.exam_id}/variants`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/question-levels
// (Get all question difficulty levels)
// ------------------------------
router.get("/question-levels", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/question-levels`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

// ------------------------------
// GET /api/lms/question-types
// (Get all question types)
// ------------------------------
router.get("/question-types", async (req, res) => {
  try {
    const client = lmsClient();
    const response = await client.get(`/question-types`);

    res.json(response.data);
  } catch (err) {
    console.error("❌ TODU ERROR:", err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

export default router;
