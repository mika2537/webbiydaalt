import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3001/api";

export default function StudentDetailPage() {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const TOKEN = import.meta.env.VITE_LMS_TOKEN;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load exams
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://todu.mn/bs/lms/v1/users/me/exams?current_user=${student_id}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!res.ok) {
          setExams([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setExams(data.items || []);
      } catch (err) {
        console.error("Load error:", err);
      }

      setLoading(false);
    }

    load();
  }, [student_id]);

  // Start exam POST
  const startExam = async (examId) => {
    try {
      const res = await fetch(
        `https://todu.mn/bs/lms/v1/users/me/exams/${examId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            current_user: student_id,
          }),
        }
      );

      const data = await res.json();
      navigate(`/team6/exams/${examId}/students/${student_id}/take`, {
        state: { attempt: data },
      });
    } catch (err) {
      console.error("Start exam failed:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ Ачааллаж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      {/* Left Sidebar */}
      <div className="w-64 bg-white shadow rounded-lg p-4 h-max">
        <h2 className="text-xl font-semibold mb-3">📚 Миний шалгалтууд</h2>

        {exams.length === 0 && (
          <p className="text-gray-500 text-sm">Шалгалт олдсонгүй</p>
        )}

        <ul className="space-y-2">
          {exams.map((exam, index) => (
            <li
              key={exam.id}
              className="bg-gray-50 rounded border p-2 hover:bg-gray-100 cursor-pointer"
            >
              <span className="font-medium">
                {index + 1}. {exam.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">🧑‍🎓 Таны шалгалтууд</h1>

        <div className="space-y-5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white shadow rounded-xl p-5 border"
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{exam.name}</h2>
                  <p className="text-gray-600 mt-1">
                    Курс: {exam.course?.name || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => startExam(exam.id)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
                >
                  ▶ Шалгалт эхлүүлэх
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
