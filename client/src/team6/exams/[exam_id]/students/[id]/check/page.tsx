import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API = "http://localhost:3001/api/lms";

interface Question {
  id: number;
  question: string;
  options: string[];
  type_id: number;
  image?: string;
  point: number;
  student_answer?: string;
  correct_answer?: string;
  is_correct?: boolean;
}

interface Exam {
  id: number;
  name: string;
  description?: string;
  total_point: number;
}

export default function CheckExamPage() {
  const { exam_id, id: student_id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, total: 0 });

  useEffect(() => {
    async function load() {
      try {
        // 1) Шалгалтын мэдээлэл авах
        const resExam = await fetch(`${API}/exams/${exam_id}`);
        const examData = await resExam.json();
        setExam(examData);

        // 2) Оролдлогын мэдээлэл авах
        const attemptsRes = await fetch(
          `${API}/exams/${exam_id}/users/${student_id}/attempts`
        );
        const attemptsData = await attemptsRes.json();
        const attempts = attemptsData.items || attemptsData || [];

        // Хамгийн сүүлийн оролдлого
        const latestAttempt =
          attempts.length > 0
            ? Math.max(...attempts.map((a: any) => a.attempt || a.id || 1))
            : 1;

        // 3) Оролдлогын асуултуудыг хариултын хамт авах
        const questionsRes = await fetch(
          `${API}/exams/${exam_id}/users/${student_id}/attempts/${latestAttempt}/questions`
        );
        const questionsData = await questionsRes.json();
        const attemptQuestions = questionsData.items || questionsData || [];

        // 4) Асуулт бүрийн дэлгэрэнгүй мэдээллийг авах
        const fullQuestions: Question[] = [];
        let correct = 0;
        let wrong = 0;

        for (const aq of attemptQuestions) {
          try {
            // Асуултын дэлгэрэнгүй мэдээлэл
            const qRes = await fetch(
              `${API}/questions/${aq.question_id || aq.id}`
            );
            const qData = await qRes.json();

            const isCorrect = aq.is_correct ?? false;
            if (isCorrect) correct++;
            else wrong++;

            fullQuestions.push({
              id: qData.id || aq.id,
              question: qData.question || aq.question || "",
              options: qData.option || qData.options || [],
              type_id: qData.type_id || aq.type_id || 0,
              image: qData.image || null,
              point: qData.point || aq.point || 0,
              student_answer: aq.answer || aq.student_answer || "",
              correct_answer: qData.answer || aq.correct_answer || "",
              is_correct: isCorrect,
            });
          } catch (err) {
            console.error("Error fetching question:", err);
          }
        }

        setQuestions(fullQuestions);
        setStats({ correct, wrong, total: fullQuestions.length });
      } catch (e) {
        console.error("Check page load error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [exam_id, student_id]);

  // Хариултыг уншигдахуйц форматруу хөрвүүлэх
  const formatAnswer = (answer: string, question: Question): string => {
    if (!answer) return "Хариулаагүй";

    // True/False
    if (question.type_id === 10) {
      if (answer === "true") return "Үнэн (True)";
      if (answer === "false") return "Худал (False)";
      return answer;
    }

    // Multiple choice - [100,0,0] format
    if (question.type_id === 20) {
      try {
        const arr = JSON.parse(answer);
        if (Array.isArray(arr)) {
          const selectedIndex = arr.findIndex((v: number) => v === 100);
          if (selectedIndex >= 0 && question.options[selectedIndex]) {
            return question.options[selectedIndex];
          }
        }
      } catch {
        // Хэрэв JSON биш бол шууд харуулах
      }
    }

    return answer;
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Шалгалтын мэдээлэл ачаалж байна...</p>
        </div>
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-gray-600">Шалгалт олдсонгүй</p>
        <Link className="underline mt-4 text-blue-600" to="/team6">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{exam.name}</h1>
              <p className="mt-1 text-gray-600">{questions.length} асуулт</p>
            </div>
            <Link to="/team6" className="text-blue-600 hover:underline">
              ← Буцах
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-4 flex gap-4">
            <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
              ✓ Зөв: {stats.correct}
            </div>
            <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg">
              ✗ Буруу: {stats.wrong}
            </div>
            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
              Нийт: {stats.total}
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={q.id}
              className={`p-6 bg-white rounded-lg shadow border-l-4 ${
                q.is_correct ? "border-green-500" : "border-red-500"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">
                  {i + 1}. {q.question}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    q.is_correct
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.is_correct ? "✓ Зөв" : "✗ Буруу"}
                </span>
              </div>

              {q.image && (
                <img
                  src={q.image}
                  alt="Question"
                  className="w-64 rounded border mb-4"
                />
              )}

              {/* Options for multiple choice */}
              {q.type_id === 20 && q.options.length > 0 && (
                <div className="mb-4 space-y-2">
                  {q.options.map((opt, idx) => {
                    let isSelected = false;
                    let isCorrect = false;

                    // Check if this option was selected
                    try {
                      const ansArr = JSON.parse(q.student_answer || "[]");
                      if (Array.isArray(ansArr) && ansArr[idx] === 100) {
                        isSelected = true;
                      }
                    } catch {}

                    // Check if this is the correct answer
                    try {
                      const correctArr = JSON.parse(q.correct_answer || "[]");
                      if (
                        Array.isArray(correctArr) &&
                        correctArr[idx] === 100
                      ) {
                        isCorrect = true;
                      }
                    } catch {}

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          isCorrect && isSelected
                            ? "bg-green-100 border-green-500"
                            : isCorrect
                            ? "bg-green-50 border-green-300"
                            : isSelected
                            ? "bg-red-100 border-red-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <span className="mr-2">
                          {isSelected && isCorrect && "✓"}
                          {isSelected && !isCorrect && "✗"}
                          {!isSelected && isCorrect && "→"}
                        </span>
                        {opt}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* True/False display */}
              {q.type_id === 10 && (
                <div className="mb-4 grid grid-cols-2 gap-3">
                  {["true", "false"].map((val) => {
                    const isSelected = q.student_answer === val;
                    const isCorrect = q.correct_answer === val;

                    return (
                      <div
                        key={val}
                        className={`p-3 rounded-lg border text-center ${
                          isCorrect && isSelected
                            ? "bg-green-100 border-green-500"
                            : isCorrect
                            ? "bg-green-50 border-green-300"
                            : isSelected
                            ? "bg-red-100 border-red-500"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {isSelected && "→ "}
                        {val === "true" ? "Үнэн (True)" : "Худал (False)"}
                        {isCorrect && " ✓"}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Answer summary */}
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Таны хариулт:</span>
                  <p
                    className={`font-medium ${
                      q.is_correct ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {formatAnswer(q.student_answer || "", q)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Зөв хариулт:</span>
                  <p className="font-medium text-green-700">
                    {formatAnswer(q.correct_answer || "", q)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() =>
              navigate(`/team6/exams/${exam_id}/students/${student_id}/result`)
            }
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            📊 Үр дүн харах
          </button>
          <Link
            to="/team6"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            🏠 Нүүр хуудас
          </Link>
        </div>
      </div>
    </div>
  );
}
