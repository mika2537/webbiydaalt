// team6/Index.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import StudentHome from "./student/StudentHome";
import TeacherHome from "./teacher/TeacherHome";

// ✅ Import TSX exam pages manually (Vite supports .tsx)
import ExamsPage from "./exams/page.tsx";
import ExamCreatePage from "./exams/create/page.tsx";
import ExamDetailPage from "./exams/[exam_id]/page.tsx";
import ExamEditPage from "./exams/[exam_id]/edit/page.tsx";
import ExamReportPage from "./exams/[exam_id]/report/page.tsx";
import ExamVariantsPage from "./exams/[exam_id]/variants/page.tsx";
import VariantCreatePage from "./exams/[exam_id]/variants/create/page.tsx";
import VariantDetailPage from "./exams/[exam_id]/variants/[id]/page.tsx";
import VariantEditPage from "./exams/[exam_id]/variants/[id]/edit/page.tsx";
import StudentDetailPage from "./exams/[exam_id]/students/student_[id]/page.tsx";
import StudentEditPage from "./exams/[exam_id]/students/student_[id]/edit/page.tsx";
import StudentCheckPage from "./exams/[exam_id]/students/student_[id]/check/page.tsx";
import StudentResultPage from "./exams/[exam_id]/students/student_[id]/result/page.tsx";

const Index = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedRole = localStorage.getItem("team6_role");
    if (savedRole) setRole(savedRole);
  }, []);

  useEffect(() => {
    if (location.pathname === "/team6" || location.pathname === "/team6/") {
      const savedRole = localStorage.getItem("team6_role");
      if (!savedRole) setRole(null);
    }
  }, [location.pathname]);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    localStorage.setItem("team6_role", selectedRole);
    navigate(`/team6/${selectedRole}`);
  };

  const handleLogout = () => {
    setRole(null);
    localStorage.removeItem("team6_role");
    navigate("/team6");
  };

  // 🧠 Role-based rendering
  if (
    !role &&
    (location.pathname === "/team6" || location.pathname === "/team6/")
  ) {
    return <RoleSelection onRoleSelect={handleRoleSelect} />;
  }

  return (
    <Routes>
      {/* Role routes */}
      <Route
        index
        element={<RoleSelection onRoleSelect={handleRoleSelect} />}
      />
      <Route path="student" element={<StudentHome onLogout={handleLogout} />} />
      <Route path="teacher" element={<TeacherHome onLogout={handleLogout} />} />

      {/* 6.10 Шалгалтын хуудсууд (Exam Pages) */}
      {/* 1. Course-based exam list */}
      <Route path="courses/:courseId/exams" element={<ExamsPage />} />
      {/* 2. Course-based exam creation */}
      <Route
        path="courses/:courseId/exams/create"
        element={<ExamCreatePage />}
      />

      {/* 3. Exam detail - /exams/:exam_id */}
      <Route path="exams/:examId" element={<ExamDetailPage />} />
      {/* 4. Exam edit - /exams/:exam_id/edit */}
      <Route path="exams/:examId/edit" element={<ExamEditPage />} />
      {/* 5. Exam report/statistics - /exams/:exam_id/report */}
      <Route path="exams/:examId/report" element={<ExamReportPage />} />

      {/* 6.11 Шалгалтын вариантын хуудсууд (Exam Variant Pages) */}
      {/* 1. Variant list - /exams/:exam_id/variants */}
      <Route path="exams/:examId/variants" element={<ExamVariantsPage />} />
      {/* 2. Variant creation - /exams/:exam_id/variants/create */}
      <Route
        path="exams/:examId/variants/create"
        element={<VariantCreatePage />}
      />
      {/* 3. Variant detail - /exams/:exam_id/variants/:id */}
      <Route
        path="exams/:examId/variants/:id"
        element={<VariantDetailPage />}
      />
      {/* 4. Variant edit - /exams/:exam_id/variants/:id/edit */}
      <Route
        path="exams/:examId/variants/:id/edit"
        element={<VariantEditPage />}
      />

      {/* 6.12 Шалгалт авах хуудсууд (Take Exam Pages) */}
      {/* 1. Start exam - /exams/:exam_id/students/:student_id */}
      <Route
        path="exams/:examId/students/:studentId"
        element={<StudentDetailPage />}
      />
      {/* 2. Take exam - /exams/:exam_id/students/:student_id/edit */}
      <Route
        path="exams/:examId/students/:studentId/edit"
        element={<StudentEditPage />}
      />
      {/* 3. Check correct answers - /exams/:exam_id/students/:student_id/check */}
      <Route
        path="exams/:examId/students/:studentId/check"
        element={<StudentCheckPage />}
      />
      {/* 4. Exam results - /exams/:exam_id/students/:student_id/result */}
      <Route
        path="exams/:examId/students/:studentId/result"
        element={<StudentResultPage />}
      />
    </Routes>
  );
};

export default Index;
