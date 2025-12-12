import express from "express";
import axios from "axios";

const router = express.Router();
const LMS_API = "https://todu.mn/bs/lms/v1";

const headers = () => ({
  Authorization: `Bearer ${process.env.LMS_TOKEN}`,
  Accept: "application/json",
  "Content-Type": "application/json",
});

/* ------------------------------------------
   GET /api/lms/exams/:exam_id - Get exam info
------------------------------------------- */
router.get("/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.get(`${LMS_API}/exams/${req.params.exam_id}`, {
      headers: headers(),
    });
    res.json(r.data);
  } catch (err) {
    console.error("❌ GET EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET /api/lms/courses/:course_id/users - Get course users
------------------------------------------- */
router.get("/courses/:course_id/users", async (req, res) => {
  try {
    const r = await axios.get(
      `${LMS_API}/courses/${req.params.course_id}/users`,
      {
        headers: headers(),
      }
    );
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ GET COURSE USERS ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET exam questions (student-specific)
------------------------------------------- */
router.get("/exams/:exam_id/questions", async (req, res) => {
  try {
    const r = await axios.get(
      `${LMS_API}/users/me/exams/${req.params.exam_id}/questions`,
      {
        headers: headers(),
        params: { current_user: req.query.student_id },
      }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ GET QUESTIONS ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET /api/lms/questions/:id - Get question detail
------------------------------------------- */
router.get("/questions/:id", async (req, res) => {
  try {
    const r = await axios.get(`${LMS_API}/questions/${req.params.id}`, {
      headers: headers(),
    });
    res.json(r.data);
  } catch (err) {
    console.error("❌ GET QUESTION ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   SAVE ONE ANSWER
------------------------------------------- */
router.put("/users/me/exams/:exam_id/questions", async (req, res) => {
  try {
    const r = await axios.put(
      `${LMS_API}/users/me/exams/${req.params.exam_id}/questions`,
      { id: req.body.id, answer: req.body.answer },
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ SAVE ANSWER ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   SUBMIT FULL EXAM → ARRAY OF ANSWERS
------------------------------------------- */
router.put("/users/me/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.put(
      `${LMS_API}/users/me/exams/${req.params.exam_id}`,
      req.body, // array [{id, answer}]
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ SUBMIT EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   START EXAM (Create exam sheet)
   POST /users/me/exams/:exam_id
------------------------------------------- */
router.post("/users/me/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.post(
      `${LMS_API}/users/me/exams/${req.params.exam_id}`,
      {}, // empty body
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ START EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET MY EXAM INFO
   GET /users/me/exams/:exam_id
------------------------------------------- */
router.get("/users/me/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.get(
      `${LMS_API}/users/me/exams/${req.params.exam_id}`,
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ GET MY EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET EXAM EVALUATION (result/score)
   GET /exams/:exam_id/users/:user_id/attempts/:attempt/evaluation
------------------------------------------- */
router.get(
  "/exams/:exam_id/users/:user_id/attempts/:attempt/evaluation",
  async (req, res) => {
    try {
      const { exam_id, user_id, attempt } = req.params;
      const r = await axios.get(
        `${LMS_API}/exams/${exam_id}/users/${user_id}/attempts/${attempt}/evaluation`,
        { headers: headers() }
      );

      res.json(r.data);
    } catch (err) {
      console.error(
        "❌ GET EVALUATION ERROR:",
        err.response?.data || err.message
      );
      res.status(500).json(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------------
   GET USER ATTEMPTS
   GET /exams/:exam_id/users/:user_id/attempts
------------------------------------------- */
router.get("/exams/:exam_id/users/:user_id/attempts", async (req, res) => {
  try {
    const { exam_id, user_id } = req.params;
    const r = await axios.get(
      `${LMS_API}/exams/${exam_id}/users/${user_id}/attempts`,
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ GET ATTEMPTS ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET ATTEMPT QUESTIONS WITH ANSWERS
   GET /exams/:exam_id/users/:user_id/attempts/:attempt/questions
------------------------------------------- */
router.get(
  "/exams/:exam_id/users/:user_id/attempts/:attempt/questions",
  async (req, res) => {
    try {
      const { exam_id, user_id, attempt } = req.params;
      const r = await axios.get(
        `${LMS_API}/exams/${exam_id}/users/${user_id}/attempts/${attempt}/questions`,
        { headers: headers() }
      );

      res.json(r.data);
    } catch (err) {
      console.error(
        "❌ GET ATTEMPT QUESTIONS ERROR:",
        err.response?.data || err.message
      );
      res.status(500).json(err.response?.data || err.message);
    }
  }
);

/* ------------------------------------------
   GET ALL MY EXAMS
   GET /users/me/exams
------------------------------------------- */
router.get("/users/me/exams", async (req, res) => {
  try {
    const r = await axios.get(`${LMS_API}/users/me/exams`, {
      headers: headers(),
    });

    res.json(r.data);
  } catch (err) {
    console.error("❌ GET MY EXAMS ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   UPDATE EXAM
   PUT /exams/:exam_id
------------------------------------------- */
router.put("/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.put(
      `${LMS_API}/exams/${req.params.exam_id}`,
      req.body,
      { headers: headers() }
    );

    res.json(r.data);
  } catch (err) {
    console.error("❌ UPDATE EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   DELETE EXAM
   DELETE /exams/:exam_id
------------------------------------------- */
router.delete("/exams/:exam_id", async (req, res) => {
  try {
    const r = await axios.delete(`${LMS_API}/exams/${req.params.exam_id}`, {
      headers: headers(),
    });

    res.json(r.data);
  } catch (err) {
    console.error("❌ DELETE EXAM ERROR:", err.response?.data || err.message);
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET COURSE QUESTIONS
   GET /courses/:course_id/questions
------------------------------------------- */
router.get("/courses/:course_id/questions", async (req, res) => {
  try {
    const { limit = 100, offset = 0, level_id } = req.query;
    let url = `${LMS_API}/courses/${req.params.course_id}/questions?limit=${limit}&offset=${offset}`;
    if (level_id) url += `&level_id=${level_id}`;

    const r = await axios.get(url, { headers: headers() });
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ GET COURSE QUESTIONS ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   CREATE QUESTION
   POST /courses/:course_id/questions
------------------------------------------- */
router.post("/courses/:course_id/questions", async (req, res) => {
  try {
    const r = await axios.post(
      `${LMS_API}/courses/${req.params.course_id}/questions`,
      req.body,
      { headers: headers() }
    );
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ CREATE QUESTION ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   UPDATE QUESTION
   PUT /questions/:question_id
------------------------------------------- */
router.put("/questions/:question_id", async (req, res) => {
  try {
    const r = await axios.put(
      `${LMS_API}/questions/${req.params.question_id}`,
      req.body,
      { headers: headers() }
    );
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ UPDATE QUESTION ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET QUESTION LEVELS
   GET /question-levels
------------------------------------------- */
router.get("/question-levels", async (req, res) => {
  try {
    const r = await axios.get(`${LMS_API}/question-levels`, {
      headers: headers(),
    });
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ GET QUESTION LEVELS ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET QUESTION TYPES
   GET /question-types
------------------------------------------- */
router.get("/question-types", async (req, res) => {
  try {
    const r = await axios.get(`${LMS_API}/question-types`, {
      headers: headers(),
    });
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ GET QUESTION TYPES ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

/* ------------------------------------------
   GET EXAM QUESTIONS (for teacher/admin view)
   GET /exams/:exam_id/questions
------------------------------------------- */
router.get("/exams/:exam_id/all-questions", async (req, res) => {
  try {
    const r = await axios.get(
      `${LMS_API}/exams/${req.params.exam_id}/questions`,
      {
        headers: headers(),
      }
    );
    res.json(r.data);
  } catch (err) {
    console.error(
      "❌ GET EXAM ALL QUESTIONS ERROR:",
      err.response?.data || err.message
    );
    res.status(500).json(err.response?.data || err.message);
  }
});

export default router;
