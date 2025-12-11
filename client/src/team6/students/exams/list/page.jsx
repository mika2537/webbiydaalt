import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function StudentDetailPage() {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const TOKEN = import.meta.env.VITE_LMS_TOKEN;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load user exams
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://todu.mn/bs/lms/v1/users/me/exams?current_user=${student_id}`,
          {
            method: "GET",
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
  }, [student_id, TOKEN]);

  // ---------- START EXAM (POST) ----------
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
      console.log("Exam started:", data);

      navigate(`/team6/exams/${examId}/students/${student_id}/take`, {
        state: { attempt: data },
      });
    } catch (err) {
      console.error("Start exam failed:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачааллаж байна...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🧑‍🎓 Таны шалгалтууд</h1>

        {exams.length === 0 && (
          <div className="text-gray-500">❌ Шалгалт олдсонгүй</div>
        )}

        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{exam.name}</h2>
                <p className="text-gray-600">
                  Курс: {exam.course?.name || "N/A"}
                </p>
              </div>

              {/* Replace Link → Button with POST request */}
              <button
                onClick={() => startExam(exam.id)}
                className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                ▶ Шалгалт эхлүүлэх
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
