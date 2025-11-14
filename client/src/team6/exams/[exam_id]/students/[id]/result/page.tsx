import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  mockExams,
  mockQuestionBank,
  mockStudentExams,
} from "../../../../../data/mockData";

interface StudentAnswer {
  questionId: number;
  response: string[];
}

interface StudentExam {
  id?: number;
  examId?: number;
  studentId?: number;
  studentName?: string;
  variantId?: number;
  status?: string;
  startTime?: string | null;
  endTime?: string | null;
  score?: number | null;
  answers: StudentAnswer[];
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
  const { examId, studentId } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [studentExam, setStudentExam] = useState<StudentExam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExamData = () => {
      const foundExam = mockExams.find((e) => e.id === Number(examId));
      const foundStudentExam = mockStudentExams.find(
        (s) => s.examId === Number(examId) && s.studentId === Number(studentId)
      );

      if (!foundExam) {
        setLoading(false);
        return;
      }

      setExam(foundExam);

      // ⬇️ LOCAL STORAGE-оос хариултуудыг унших
      const localAnswers = JSON.parse(
        sessionStorage.getItem(`exam_${examId}_answers`) || "{}"
      );

      // ⬇️ LocalStorage → StudentExam.answers болгон хөрвүүлэх
      const parsedAnswers = Object.entries(localAnswers).map(
        ([questionId, resp]) => ({
          questionId: Number(questionId),
          response: Array.isArray(resp) ? resp : [resp],
        })
      );

      // ⬇️ StudentExam merge хийж хадгална
      const safeExam: StudentExam = {
        ...(foundStudentExam || {}),
        answers: parsedAnswers,
      };

      setStudentExam(safeExam);

      // ⬇️ Асуултуудыг дээр нь авна
      const topicIds =
        foundExam.selectedTopics?.map((t: any) => t.topicId) || [];

      const examQuestions = mockQuestionBank.filter((q) =>
        topicIds.includes(q.topicId)
      );

      setQuestions(examQuestions);

      // ⬇️ Оноо бодолт
      let correctCount = 0;

      examQuestions.forEach((q) => {
        const studentAnswer = safeExam.answers.find(
          (a) => a.questionId === q.id
        )?.response;

        if (
          studentAnswer &&
          q.correctAnswers.length === studentAnswer.length &&
          q.correctAnswers.every((v) => studentAnswer.includes(v))
        ) {
          correctCount++;
        }
      });

      setScore(
        Math.round((correctCount / examQuestions.length) * foundExam.totalMarks)
      );

      setLoading(false);
    };

    loadExamData();
  }, [examId, studentId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Шалгалтын мэдээлэл ачаалж байна...
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        ❌ Шалгалт эсвэл сурагчийн мэдээлэл олдсонгүй.
        <Link
          to="/team6/student"
          className="mt-4 text-black underline hover:text-gray-700"
        >
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-8 border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {exam.title}
            </h1>
            <p className="text-gray-600">{exam.description}</p>
          </div>
          <Link
            to={`/team6/student`}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Буцах
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-blue-900">🎯 Таны дүн</h2>
            <p className="text-gray-700 mt-1">
              Нийт оноо: {score}/{exam.totalMarks}
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-900">
            {((score / exam.totalMarks) * 100).toFixed(0)}%
          </div>
        </div>

        {/* Question Review */}
        <div className="space-y-6">
          {questions.map((q, i) => {
            const studentAnswer =
              studentExam?.answers?.find(
                (a: StudentAnswer) => a.questionId === q.id
              )?.response || [];

            const isCorrect =
              studentAnswer.length > 0 &&
              q.correctAnswers.length === studentAnswer.length &&
              q.correctAnswers.every((ans) => studentAnswer.includes(ans));

            return (
              <div
                key={q.id}
                className={`p-5 rounded-lg border-2 ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {i + 1}. {q.question}
                </h3>

                {q.image && (
                  <img
                    src={q.image}
                    alt="Question"
                    className="w-64 rounded-md border mb-3"
                  />
                )}

                {q.options && (
                  <ul className="ml-5 mb-2 list-disc text-gray-700 text-sm">
                    {q.options.map((opt, idx) => (
                      <li
                        key={idx}
                        className={`p-1 rounded ${
                          studentAnswer.includes(opt)
                            ? isCorrect
                              ? "text-green-700 font-semibold"
                              : "text-red-700 font-semibold"
                            : ""
                        }`}
                      >
                        {opt}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="text-sm mt-2">
                  <p>
                    🟢 Зөв хариулт:{" "}
                    <span className="font-semibold text-green-700">
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
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
