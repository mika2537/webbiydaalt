import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface StudentAnswer {
  questionId: number;
  response: string[];
}

interface StudentExam {
  exam_id: number;
  student_id: number;
  answers: StudentAnswer[];
  score?: number;
}

interface Question {
  id: number;
  question: string;
  options?: string[];
  correctAnswers: string[];
  type: string;
  marks: number;
  image?: string;
}

export default function CheckExamPage() {
  const { exam_id, student_id } = useParams();

  const API_URL = "http://localhost:3001";

  const [exam, setExam] = useState<any>(null);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // ---------------------
  // 🔥 API FETCH SECTION
  // ---------------------
  useEffect(() => {
    async function load() {
      try {
        // 1. exam info
        const examRes = await fetch(`${API_URL}/exams/${exam_id}`);
        const examData = await examRes.json();
        setExam(examData);

        // 2. student answers
        const studentRes = await fetch(
          `${API_URL}/students/${exam_id}/${student_id}`
        );
        const studentData = await studentRes.json();
        setStudentExam(studentData);

        // 3. questions of exam
        const qRes = await fetch(`${API_URL}/exams/${exam_id}/questions`);
        const qData = await qRes.json();
        setQuestions(qData);

        // 4. calculate score
        let correct = 0;
        qData.forEach((q: Question) => {
          const ans = studentData.answers?.find(
            (x: StudentAnswer) => x.questionId === q.id
          )?.response;

          const isCorrect =
            ans &&
            q.correctAnswers.length === ans.length &&
            q.correctAnswers.every((x) => ans.includes(x));

          if (isCorrect) correct++;
        });

        const calculated =
          Math.round((correct / qData.length) * examData.totalMarks) || 0;

        setScore(calculated);
      } catch (err) {
        console.log("API fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [examId, student_id]);

  // ---------------------
  // Loading / Not found
  // ---------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Шалгалтын мэдээлэл ачаалж байна...
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

  // ---------------------
  // UI
  // ---------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{exam.title}</h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <Link className="text-gray-600 hover:text-black" to="/team6/student">
            ← Буцах
          </Link>
        </div>

        {/* Summary */}
        <div className="p-4 bg-blue-50 border rounded-lg flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">🎯 Таны дүн</h2>
            <p>
              Оноо: {score}/{exam.totalMarks}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {((score / exam.totalMarks) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Question Review */}
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
                className={`p-5 border-2 rounded-lg ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                {/* Question text */}
                <h3 className="font-semibold mb-2">
                  {i + 1}. {q.question}
                </h3>

                {/* Image */}
                {q.image && (
                  <img src={q.image} className="w-64 border rounded mb-3" />
                )}

                {/* Options */}
                {q.options && q.options.length > 0 && (
                  <ul className="list-disc ml-5 text-sm">
                    {q.options.map((opt, idx) => (
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

                {/* Correct / Your answer */}
                <div className="text-sm mt-3">
                  <p>
                    🟢 Зөв:{" "}
                    <span className="font-semibold">
                      {q.correctAnswers.join(", ")}
                    </span>
                  </p>

                  <p>
                    🔵 Таны хариулт:{" "}
                    <span
                      className={`font-semibold ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
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
            to="/team6"
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
