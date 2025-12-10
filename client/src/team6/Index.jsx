// team6/Index.jsx
import { Routes, Route } from "react-router-dom";
import Team6Home from "./Home..jsx";

<<<<<<< HEAD
// Exam Pages
import ExamsPage from "./exams/page.tsx";
import CreateExamPage from "./exams/create/page.tsx"; // <-- FIXED IMPORT
=======
// Exam Pages (Course-based)
import ExamsPage from "./courses/[course_id]/exams/page.tsx";
import ExamCreatePage from "./courses/[course_id]/exams/create/page.tsx";

// Exam Detail Pages
>>>>>>> origin/main
import ExamDetailPage from "./exams/[exam_id]/page.tsx";
import ExamEditPage from "./exams/[exam_id]/edit/page.tsx";
import ExamReportPage from "./exams/[exam_id]/report/page.tsx";

// Variant Pages
import ExamVariantsPage from "./exams/[exam_id]/variants/page.tsx";
import VariantCreatePage from "./exams/[exam_id]/variants/create/page.tsx";
import VariantDetailPage from "./exams/[exam_id]/variants/[id]/page.tsx";
import VariantEditPage from "./exams/[exam_id]/variants/[id]/edit/page.tsx";

// Student exam pages
import StudentDetailPage from "./exams/[exam_id]/students/[id]/page.tsx";
import StudentTakePage from "./exams/[exam_id]/students/[id]/take/page.tsx";
import StudentCheckPage from "./exams/[exam_id]/students/[id]/check/page.tsx";
import StudentResultPage from "./exams/[exam_id]/students/[id]/result/page.tsx";

<<<<<<< HEAD
=======
// Question Pages
import QuestionDetailPage from "./courses/[course_id]/questions/[question_id]/page.tsx";

>>>>>>> origin/main
export default function Index() {
  return (
    <Routes>
      {/* =========== HOME PAGE =========== */}
      <Route index element={<Team6Home />} />

<<<<<<< HEAD
      {/* =========== EXAM MANAGEMENT =========== */}
      <Route path="courses/:courseId/exams" element={<ExamsPage />} />

      {/* CREATE EXAM PAGE */}
      <Route
        path="courses/:courseId/exams/create"
        element={<CreateExamPage />}
=======
      {/* =========== EXAM MANAGEMENT PAGES (Teacher) =========== */}
      <Route path="courses/:course_id/exams" element={<ExamsPage />} />
      <Route
        path="courses/:course_id/exams/create"
        element={<ExamCreatePage />}
>>>>>>> origin/main
      />

      <Route path="exams/:exam_id" element={<ExamDetailPage />} />
      <Route path="exams/:exam_id/edit" element={<ExamEditPage />} />
      <Route path="exams/:exam_id/report" element={<ExamReportPage />} />

<<<<<<< HEAD
      {/* VARIANTS */}
      <Route path="exams/:examId/variants" element={<ExamVariantsPage />} />
=======
      {/* Variants */}
      <Route path="exams/:exam_id/variants" element={<ExamVariantsPage />} />
>>>>>>> origin/main
      <Route
        path="exams/:exam_id/variants/create"
        element={<VariantCreatePage />}
      />
      <Route
        path="exams/:exam_id/variants/:id"
        element={<VariantDetailPage />}
      />
      <Route
        path="exams/:exam_id/variants/:id/edit"
        element={<VariantEditPage />}
      />

      {/* STUDENT PAGES */}
      <Route
        path="exams/:exam_id/students/:student_id"
        element={<StudentDetailPage />}
      />
      <Route
        path="exams/:exam_id/students/:student_id/take"
        element={<StudentTakePage />}
      />
      <Route
        path="exams/:exam_id/students/:student_id/check"
        element={<StudentCheckPage />}
      />
      <Route
        path="exams/:exam_id/students/:student_id/result"
        element={<StudentResultPage />}
      />

      {/* =========== QUESTION PAGES =========== */}
      <Route
        path="courses/:course_id/questions/:question_id"
        element={<QuestionDetailPage />}
      />
    </Routes>
  );
}
