import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api";

import BackButton from "../../../components/BackButton";

export default function ExamReportPage() {
  const { examId } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const examRes = await fetch(`${API_URL}/exams/${examId}`);
        const examData = await examRes.json();

        const statsRes = await fetch(`${API_URL}/exams/${examId}/stats`);
        const statsData = await statsRes.json();

        const resultsRes = await fetch(`${API_URL}/exams/${examId}/students`);
        const resultsData = await resultsRes.json();

        setExam(examData);
        setStats(statsData);
        setStudentResults(Array.isArray(resultsData) ? resultsData : []);
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadReport();
  }, [examId]);

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
        {/* Header */}
        <div className="mb-8">
          <BackButton variant="link" className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Шалгалтын тайлан
          </h1>
          <p className="text-gray-600">{exam?.title || "Нэргүй шалгалт"}</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          <StatCard
            value={stats.totalStudents}
            label="Нийт оролцогчид"
            color="text-gray-900"
          />
          <StatCard
            value={stats.completedStudents}
            label="Дууссан"
            color="text-green-600"
          />
          <StatCard
            value={stats.averageScore}
            label="Дундаж оноо"
            color="text-blue-600"
          />
          <StatCard
            value={stats.highestScore}
            label="Хамгийн өндөр"
            color="text-purple-600"
          />
          <StatCard
            value={`${stats.passRate}%`}
            label="Тэнцсэн хувь"
            color="text-orange-600"
          />
        </div>

        {/* Chart (Static Example) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Онооны хуваарилалт
          </h2>
          <div className="h-64 flex items-end justify-around gap-4 border-b border-l border-gray-200 p-4">
            <ChartBar height="40%" color="bg-red-500" range="0-40" count="5" />
            <ChartBar
              height="60%"
              color="bg-orange-500"
              range="41-60"
              count="12"
            />
            <ChartBar
              height="85%"
              color="bg-yellow-500"
              range="61-80"
              count="18"
            />
            <ChartBar
              height="50%"
              color="bg-green-500"
              range="81-100"
              count="10"
            />
          </div>
        </div>

        {/* Student Results */}
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
                    Суралцагчийн нэр
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Оноо
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Үр дүн
                  </th>
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
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {s.studentName || "Нэргүй"}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {s.score !== null && s.score !== undefined ? (
                          <span className="font-semibold">
                            {s.score}/{exam.totalMarks}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {s.score !== null && s.score !== undefined ? (
                          s.score >= exam.passingMarks ? (
                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              Тэнцсэн
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              Тэнцээгүй
                            </span>
                          )
                        ) : (
                          <span className="text-gray-400">-</span>
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

const StatCard = ({
  value,
  label,
  color,
}: {
  value: string | number;
  label: string;
  color: string;
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
    <div className={`text-4xl font-bold mb-2 ${color}`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const ChartBar = ({
  height,
  color,
  range,
  count,
}: {
  height: string;
  color: string;
  range: string;
  count: string;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className={`w-16 ${color} rounded-t`} style={{ height }}></div>
    <div className="text-sm font-medium text-gray-700">{range}</div>
    <div className="text-xs text-gray-500">{count} хүн</div>
  </div>
);
