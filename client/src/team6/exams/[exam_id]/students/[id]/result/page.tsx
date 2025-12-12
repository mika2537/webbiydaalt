import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_URL = "http://localhost:3001/api";

interface EvaluationResult {
  exam_id: string;
  user_id: string;
  attempt: number;
  score: number;
  total_point: number;
  grade_point: number;
  passed: boolean;
  correct: number;
  wrong: number;
  total: number;
  exam_name?: string;
}

export default function ResultPage() {
  const { exam_id, id: student_id } = useParams();
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        // 1) Эхлээд оролдлогын мэдээллийг авах
        const attemptsRes = await fetch(
          `${API_URL}/lms/exams/${exam_id}/users/${student_id}/attempts`
        );

        if (!attemptsRes.ok) {
          throw new Error("Оролдлогын мэдээлэл олдсонгүй");
        }

        const attemptsData = await attemptsRes.json();
        const attempts = attemptsData.items || attemptsData || [];

        // Хамгийн сүүлийн оролдлого
        const latestAttempt =
          attempts.length > 0
            ? Math.max(...attempts.map((a: any) => a.attempt || a.id || 1))
            : 1;

        // 2) Evaluation авах
        const evalRes = await fetch(
          `${API_URL}/lms/exams/${exam_id}/users/${student_id}/attempts/${latestAttempt}/evaluation`
        );

        if (!evalRes.ok) {
          // Хэрэв evaluation олдохгүй бол шалгалтын үндсэн мэдээллээс тооцох
          const examRes = await fetch(`${API_URL}/lms/exams/${exam_id}`);
          const examData = await examRes.json();

          // Attempt questions авах
          const questionsRes = await fetch(
            `${API_URL}/lms/exams/${exam_id}/users/${student_id}/attempts/${latestAttempt}/questions`
          );
          const questionsData = await questionsRes.json();
          const questions = questionsData.items || questionsData || [];

          // Зөв хариултын тоог тооцох
          let correct = 0;
          let wrong = 0;

          questions.forEach((q: any) => {
            if (q.is_correct) correct++;
            else wrong++;
          });

          const total = questions.length;
          const score = Math.round(
            (correct / Math.max(1, total)) * (examData.total_point || 100)
          );

          setResult({
            exam_id: exam_id || "",
            user_id: student_id || "",
            attempt: latestAttempt,
            score,
            total_point: examData.total_point || 100,
            grade_point: examData.grade_point || 60,
            passed: score >= (examData.grade_point || 60),
            correct,
            wrong,
            total,
            exam_name: examData.name,
          });
        } else {
          const evalData = await evalRes.json();

          setResult({
            exam_id: exam_id || "",
            user_id: student_id || "",
            attempt: latestAttempt,
            score: evalData.score || evalData.point || 0,
            total_point: evalData.total_point || 100,
            grade_point: evalData.grade_point || 60,
            passed: evalData.passed ?? evalData.score >= evalData.grade_point,
            correct: evalData.correct || 0,
            wrong: evalData.wrong || 0,
            total: evalData.total || 0,
            exam_name: evalData.exam_name,
          });
        }
      } catch (err: any) {
        console.error("Result load error:", err);
        setError(err.message || "Алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [exam_id, student_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Үр дүн ачаалж байна...</p>
        </div>
      </div>
    );

  if (error || !result)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-gray-600 mb-4">{error || "Үр дүн олдсонгүй"}</p>
        <Link to="/team6" className="text-blue-600 underline">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{result.passed ? "🎉" : "😔"}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Шалгалтын үр дүн
            </h1>
            {result.exam_name && (
              <p className="text-gray-600">{result.exam_name}</p>
            )}
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div
              className={`inline-block px-8 py-6 rounded-xl ${
                result.passed
                  ? "bg-green-100 border-2 border-green-500"
                  : "bg-red-100 border-2 border-red-500"
              }`}
            >
              <div className="text-5xl font-bold mb-2">
                {result.score}
                <span className="text-2xl text-gray-500">
                  /{result.total_point}
                </span>
              </div>
              <div
                className={`text-xl font-semibold ${
                  result.passed ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.passed ? "ТЭНЦСЭН ✅" : "ТЭНЦЭЭГҮЙ ❌"}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatBox label="Зөв хариулт" value={result.correct} color="green" />
            <StatBox label="Буруу хариулт" value={result.wrong} color="red" />
            <StatBox label="Нийт асуулт" value={result.total} color="blue" />
            <StatBox
              label="Тэнцэх оноо"
              value={result.grade_point}
              color="gray"
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>0</span>
              <span>Тэнцэх оноо: {result.grade_point}</span>
              <span>{result.total_point}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  result.passed ? "bg-green-500" : "bg-red-500"
                }`}
                style={{
                  width: `${(result.score / result.total_point) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Link
              to={`/team6/exams/${exam_id}/students/${student_id}/check`}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              📋 Хариултууд харах
            </Link>
            <Link
              to="/team6"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              🏠 Нүүр хуудас
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "green" | "red" | "blue" | "gray";
}) => {
  const colorClasses = {
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm">{label}</div>
    </div>
  );
};
