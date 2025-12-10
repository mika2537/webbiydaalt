// team6/Index.jsx
import { Routes, Route } from "react-router-dom";
import Team6Home from "./Home..jsx";

// ===================== EXAM PAGES =====================
import ExamsPage from "./courses/[course_id]/exams/page.tsx";
import CreateExamPage from "./courses/[course_id]/exams/create/page.tsx";

import ExamDetailPage from "./exams/[exam_id]/page.tsx";
import ExamEditPage from "./exams/[exam_id]/edit/page.tsx";
import ExamReportPage from "./exams/[exam_id]/report/page.tsx";

// ===================== VARIANT PAGES =====================
import ExamVariantsPage from "./exams/[exam_id]/variants/page.tsx";
import VariantCreatePage from "./exams/[exam_id]/variants/create/page.tsx";
import VariantDetailPage from "./exams/[exam_id]/variants/[id]/page.tsx";
import VariantEditPage from "./exams/[exam_id]/variants/[id]/edit/page.tsx";

// ===================== STUDENT PAGES =====================
import StudentDetailPage from "./exams/[exam_id]/students/[id]/page.tsx";
import StudentTakePage from "./exams/[exam_id]/students/[id]/take/page.tsx";
import StudentCheckPage from "./exams/[exam_id]/students/[id]/check/page.tsx";
import StudentResultPage from "./exams/[exam_id]/students/[id]/result/page.tsx";

// ===================== QUESTION PAGE =====================
import QuestionDetailPage from "./courses/[course_id]/questions/[question_id]/page.tsx";

export default function Index() {
  return (
    <Routes>
      {/* HOME */}
      <Route index element={<Team6Home />} />

      {/* LIST EXAMS OF COURSE */}
      <Route path="courses/:courseId/exams" element={<ExamsPage />} />

      {/* CREATE NEW EXAM */}
      <Route
        path="courses/:courseId/exams/create"
        element={<CreateExamPage />}
      />

      {/* EXAM DETAIL */}
      <Route path="exams/:exam_id" element={<ExamDetailPage />} />
      <Route path="exams/:exam_id/edit" element={<ExamEditPage />} />
      <Route path="exams/:exam_id/report" element={<ExamReportPage />} />

      {/* VARIANTS */}
      <Route path="exams/:exam_id/variants" element={<ExamVariantsPage />} />
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

      <Route
        path="students/:student_id/exams/take"
        element={<StudentTakePage />}
      />

      {/* QUESTION PAGE */}
      <Route
        path="courses/:course_id/questions/:question_id"
        element={<QuestionDetailPage />}
      />
    </Routes>
  );
}
