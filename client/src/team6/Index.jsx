// team6/Index.jsx
import { Routes, Route } from "react-router-dom";
import Team6Home from "./Home..jsx";

// Exam Pages
import ExamsPage from "./exams/page.tsx";
import CreateExamPage from "./exams/create/page.tsx"; // <-- FIXED IMPORT
import ExamDetailPage from "./exams/[exam_id]/page.tsx";
import ExamEditPage from "./exams/[exam_id]/edit/page.tsx";
import ExamReportPage from "./exams/[exam_id]/report/page.tsx";
import ExamVariantsPage from "./exams/[exam_id]/variants/page.tsx";
import VariantCreatePage from "./exams/[exam_id]/variants/create/page.tsx";
import VariantDetailPage from "./exams/[exam_id]/variants/[id]/page.tsx";
import VariantEditPage from "./exams/[exam_id]/variants/[id]/edit/page.tsx";

// Student exam pages
import StudentDetailPage from "./exams/[exam_id]/students/[id]/page.tsx";
import StudentEditPage from "./exams/[exam_id]/students/[id]/edit/page.tsx";
import StudentCheckPage from "./exams/[exam_id]/students/[id]/check/page.tsx";
import StudentResultPage from "./exams/[exam_id]/students/[id]/result/page.tsx";

export default function Index() {
  return (
    <Routes>
      {/* =========== HOME PAGE =========== */}
      <Route index element={<Team6Home />} />

      {/* =========== EXAM MANAGEMENT =========== */}
      <Route path="courses/:courseId/exams" element={<ExamsPage />} />

      {/* CREATE EXAM PAGE */}
      <Route
        path="courses/:courseId/exams/create"
        element={<CreateExamPage />}
      />

      <Route path="exams/:examId" element={<ExamDetailPage />} />
      <Route path="exams/:examId/edit" element={<ExamEditPage />} />
      <Route path="exams/:examId/report" element={<ExamReportPage />} />

      {/* VARIANTS */}
      <Route path="exams/:examId/variants" element={<ExamVariantsPage />} />
      <Route
        path="exams/:examId/variants/create"
        element={<VariantCreatePage />}
      />
      <Route
        path="exams/:examId/variants/:id"
        element={<VariantDetailPage />}
      />
      <Route
        path="exams/:examId/variants/:id/edit"
        element={<VariantEditPage />}
      />

      {/* STUDENT PAGES */}
      <Route
        path="exams/:examId/students/:studentId"
        element={<StudentDetailPage />}
      />
      <Route
        path="exams/:examId/students/:studentId/edit"
        element={<StudentEditPage />}
      />
      <Route
        path="exams/:examId/students/:studentId/check"
        element={<StudentCheckPage />}
      />
      <Route
        path="exams/:examId/students/:studentId/result"
        element={<StudentResultPage />}
      />
    </Routes>
  );
}
