import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function StudentDetailPage() {
  const { student_id } = useParams();
  const TOKEN = import.meta.env.VITE_LMS_TOKEN;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      console.log("Using token:", TOKEN);

      try {
        const res = await fetch(
          `https://todu.mn/bs/lms/v1/users/${student_id}/exams`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        console.log("STATUS:", res.status);

        if (!res.ok) {
          console.error("❌ FAILED:", res.status);
          setExams([]); // prevents undefined
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("DATA:", data);

        setExams(data.items || []);
      } catch (err) {
        console.error("❌ Error loading:", err);
      }

      setLoading(false);
    }

    load();
  }, [student_id, TOKEN]);

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
          <div className="text-gray-500">
            ❌ Шалгалт олдсонгүй (Token буруу байж магадгүй)
          </div>
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

              <Link
                to={`/team6/exams/${exam.id}/students/${student_id}/take`}
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
