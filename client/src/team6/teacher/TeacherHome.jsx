// team6/teacher/TeacherHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const TeacherHome = ({ onLogout }) => {
  const navigate = useNavigate();

  const examId = 1;
  const studentId = 1;

  const screens = [
    { name: "🧾 Шалгалтууд", path: "/team6/exams", color: "bg-blue-100" },
    {
      name: "🧩 Вариантууд",
      path: `/team6/exams/${examId}/variants`,
      color: "bg-green-100",
    },
    {
      name: "📊 Шалгалтын дүн",
      path: `/team6/exams/${examId}/report`,
      color: "bg-yellow-100",
    },
    {
      name: "👨‍🎓 Оюутнууд",
      path: `/team6/exams/${examId}/students/student_${studentId}/check`,
      color: "bg-purple-100",
    },
    {
      name: "✏️ Шалгалт засварлах",
      path: `/team6/exams/${examId}/edit`,
      color: "bg-pink-100",
    },
    {
      name: "📝 Шалгалт үүсгэх",
      path: "/team6/exams/create",
      color: "bg-cyan-100",
    },
    {
      name: "🧠 Оюутны үнэлгээ",
      path: `/team6/exams/${examId}/students/student_${studentId}/result`,
      color: "bg-orange-100",
    },
    {
      name: "📚 Суралцагчийн хуудас",
      path: "/team6/student/StudentHome",
      color: "bg-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              👨‍🏫 Багшийн хянах самбар
            </h1>
            <p className="text-gray-600 mt-1">
              Шалгалт, оюутан болон хичээлийн мэдээллээ удирдаарай.
            </p>
          </div>
          <button
            onClick={onLogout}
            className="px-5 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300"
          >
            Гарах
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {screens.map((screen, index) => (
            <div
              key={index}
              onClick={() => navigate(screen.path)}
              className={`cursor-pointer p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center ${screen.color}`}
            >
              <div className="text-5xl mb-3">{screen.name.split(" ")[0]}</div>
              <div className="text-lg font-semibold text-gray-800 text-center">
                {screen.name.replace(/^[^\s]+\s/, "")}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TeacherHome;
