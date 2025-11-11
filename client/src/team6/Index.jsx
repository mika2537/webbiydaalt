// team6/Index.jsx
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import RoleSelection from "./RoleSelection";
import StudentHome from "./student/StudentHome";
import TeacherHome from "./teacher/TeacherHome";

// ✅ Import TSX exam pages manually (Vite supports .tsx)
import ExamsPage from "./exams/page.tsx";
import ExamCreatePage from "./exams/create/page.tsx";
import ExamEditPage from "./exams/[exam_id]/edit/page.tsx";
import ExamReportPage from "./exams/[exam_id]/report/page.tsx";
import ExamVariantsPage from "./exams/[exam_id]/variants/page.tsx";
import VariantEditPage from "./exams/[exam_id]/variants/[id]/edit/page.tsx";
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

      {/* ✅ Exam routes based on your folder structure */}
      <Route path="exams" element={<ExamsPage />} />
      <Route path="exams/create" element={<ExamCreatePage />} />
      <Route path="exams/:examId/edit" element={<ExamEditPage />} />
      <Route path="exams/:examId/report" element={<ExamReportPage />} />
      <Route path="exams/:examId/variants" element={<ExamVariantsPage />} />
      <Route
        path="exams/:examId/variants/:variantId/edit"
        element={<VariantEditPage />}
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
};

export default Index;
