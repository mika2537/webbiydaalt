import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api";

import BackButton from "../../../components/BackButton";

export default function ExamReportPage() {
  const { exam_id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
<<<<<<< HEAD
        // Load exam
        const examRes = await fetch(`${API_URL}/exams/${examId}`);
        const examData = await examRes.json();

        // Load stats (correct endpoint)
        const statsRes = await fetch(`${API_URL}/exams/${examId}/report`);
        const statsData = await statsRes.json();

        // Load students
        const resultsRes = await fetch(`${API_URL}/exams/${examId}/students`);
=======
        const examRes = await fetch(`${API_URL}/exams/${exam_id}`);
        const examData = await examRes.json();

        const statsRes = await fetch(`${API_URL}/exams/${exam_id}/stats`);
        const statsData = await statsRes.json();

        const resultsRes = await fetch(`${API_URL}/exams/${exam_id}/students`);
>>>>>>> origin/main
        const resultsData = await resultsRes.json();

        setExam(examData);
        setStats(statsData?.stats || statsData);
        setStudentResults(Array.isArray(resultsData) ? resultsData : []);
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadReport();
  }, [exam_id]);

  const getStatusBadge = (status: string) => {
    const badges: any = {
      not_started: "bg-gray-100 text-gray-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
    };
    const labels: any = {
      not_started: "Эхлээгүй",
      in_progress: "Явагдаж байна",
      completed: "Дууссан",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          badges[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[status] || "Тодорхойгүй"}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );
  }

  if (!exam || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Тайлан олдсонгүй
          </h2>
          <Link to="/team6/exams" className="text-black hover:underline">
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <BackButton variant="link" className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Шалгалтын тайлан
          </h1>
          <p className="text-gray-600">{exam?.name}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            value={stats.total}
            label="Нийт оролцогчид"
            color="text-gray-900"
          />
          <StatCard
            value={stats.passed}
            label="Тэнцсэн"
            color="text-green-600"
          />
          <StatCard
            value={stats.failed}
            label="Тэнцээгүй"
            color="text-red-600"
          />
          <StatCard
            value={stats.average || 0}
            label="Дундаж оноо"
            color="text-blue-600"
          />
          <StatCard
            value={stats.highest || 0}
            label="Хамгийн өндөр"
            color="text-purple-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Суралцагчдын үр дүн
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    №
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Нэр
                  </th>
                  <th className="px-6 py-3">Статус</th>
                  <th className="px-6 py-3">Оноо</th>
                  <th className="px-6 py-3">Үр дүн</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {studentResults.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Суралцагчдын мэдээлэл байхгүй байна
                    </td>
                  </tr>
                ) : (
                  studentResults.map((s, index) => (
                    <tr key={s.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{index + 1}</td>

                      <td className="px-6 py-4 font-medium">
                        {s.name || "Нэргүй"}
                      </td>

                      <td className="px-6 py-4">{getStatusBadge(s.status)}</td>

                      <td className="px-6 py-4">
                        {s.score != null ? (
                          <span className="font-semibold">
                            {s.score}/{exam.total_point}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {s.score != null ? (
                          s.score >= exam.grade_point ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Тэнцсэн
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              Тэнцээгүй
                            </span>
                          )
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ value, label, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
    <div className={`text-4xl font-bold mb-2 ${color}`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);
