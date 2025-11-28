import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

interface StudentAnswer {
  questionId: number;
  response: string[];
}

interface StudentExam {
  examId: number;
  studentId: number;
  answers: StudentAnswer[];
  score?: number;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswers: string[];
  marks: number;
  type: string;
  image?: string;
}

export default function CheckExamPage() {
  const { examId, id } = useParams();
  const API_URL = "http://localhost:3001";

  const [exam, setExam] = useState<any>(null);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // 🔥 Backend-аас өгөгдөл татах
  // ---------------------------
  useEffect(() => {
    async function load() {
      try {
        // 1. Шалгалтын мэдээлэл
        const examRes = await fetch(`${API_URL}/exams/${examId}`);
        const examData = await examRes.json();
        setExam(examData);

        // 2. Сурагчийн шалгалтын өгөгдөл
        const studentRes = await fetch(`${API_URL}/students/${examId}/${id}`);
        const studentData = await studentRes.json();
        setStudentExam(studentData);

        // 3. Шалгалтын бүх асуулт
        const questionsRes = await fetch(
          `${API_URL}/exams/${examId}/questions`
        );
        const questionsData = await questionsRes.json();
        setQuestions(questionsData);

        // 4. Дүн тооцоолох
        const correctCount = questionsData.reduce(
          (sum: number, q: Question) => {
            const studentAnswer = studentData.answers?.find(
              (a: StudentAnswer) => a.questionId === q.id
            )?.response;

            const isCorrect =
              studentAnswer &&
              q.correctAnswers.length === studentAnswer.length &&
              q.correctAnswers.every((ans) => studentAnswer.includes(ans));

            return isCorrect ? sum + 1 : sum;
          },
          0
        );

        setScore(
          Math.round(
            (correctCount / questionsData.length) * examData.totalMarks
          )
        );

        setLoading(false);
      } catch (err) {
        console.error("API error:", err);
        setLoading(false);
      }
    }

    load();
  }, [examId, id]);

  // -------------------------
  // UI Rendering
  // -------------------------

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачаалж байна...
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        ❌ Шалгалтын мэдээлэл олдсонгүй.
        <Link to="/team6/student" className="mt-4 underline">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <BackButton />
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">🎯 Таны дүн</h2>
            <p>
              Нийт оноо: {score}/{exam.totalMarks}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {((score / exam.totalMarks) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, i) => {
            const studentAnswer =
              studentExam?.answers?.find((a) => a.questionId === q.id)
                ?.response || [];

            const isCorrect =
              studentAnswer.length > 0 &&
              q.correctAnswers.length === studentAnswer.length &&
              q.correctAnswers.every((ans) => studentAnswer.includes(ans));

            return (
              <div
                key={q.id}
                className={`p-5 rounded-lg border-2
                ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  {i + 1}. {q.question}
                </h3>

                {q.image && (
                  <img src={q.image} className="w-64 rounded border mb-3" />
                )}

                {q.options?.length && (
                  <ul className="list-disc ml-5">
                    {q.options!.map((opt, idx) => (
                      <li
                        key={idx}
                        className={
                          studentAnswer.includes(opt)
                            ? isCorrect
                              ? "text-green-700 font-bold"
                              : "text-red-700 font-bold"
                            : ""
                        }
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-2 text-sm">
                  <p>
                    🟢 Зөв:{" "}
                    <span className="font-semibold">
                      {q.correctAnswers.join(", ")}
                    </span>
                  </p>
                  <p>
                    🔵 Таны хариулт:{" "}
                    <span className="font-semibold">
                      {studentAnswer.length > 0
                        ? studentAnswer.join(", ")
                        : "—"}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/team6/student"
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
