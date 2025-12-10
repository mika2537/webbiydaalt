import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TakeExamListPage() {
  const userId = 200;

  // TODO: You should store this token safely (env, server)
  const TOKEN = "mjrkegV2v6gpmWWK2miGwQ";

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://todu.mn/bs/lms/v1/users/${userId}/exams`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        if (!res.ok) {
          console.error("FAILED:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setExams(data.items || []);
      } catch (e) {
        console.error("Error loading exams:", e);
      }

      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачаалж байна...
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">🧑‍🎓 Миний шалгалтууд</h1>

        {exams.length === 0 && (
          <div className="text-gray-500">Өгөх шалгалт алга.</div>
        )}

        {exams.map((exam) => (
          <div
            key={exam.id}
            className="border p-4 rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{exam.name}</h2>
                <p className="text-gray-600">{exam.course?.name}</p>

                <p className="text-sm text-gray-500 mt-1">
                  Нийт оноо: {exam.total_point} / Тэнцэх: {exam.grade_point}
                </p>

                <p className="text-sm text-gray-500">
                  Хугацаа: {exam.duration} минут
                </p>

                <p className="text-sm text-gray-500">
                  Эхлэх: {new Date(exam.open_on).toLocaleString("mn-MN")}
                </p>

                <p className="text-sm text-gray-500">
                  Дуусах: {new Date(exam.close_on).toLocaleString("mn-MN")}
                </p>
              </div>

              {/* Start Exam Button */}
              <Link
                to={`/team6/exams/${exam.id}/students/${userId}/start`}
                className="px-5 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                ▶ Шалгалт эхлүүлэх
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
