"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface StudentAnswer {
  questionId: number;
  response: string[]; // always array for consistency
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correctAnswers: string[];
  marks: number;
  image?: string;
}

export default function CheckExamPage() {
  const { exam_id, student_id } = useParams();

  const API_URL = "http://localhost:3001";

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // 🔥 Load exam + variant + questions + student answers
  // ---------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        // 1. Load exam info
        const examRes = await fetch(`${API_URL}/exams/${exam_id}`);
        const examData = await examRes.json();
        setExam(examData);

        // 2. Load student variant
        const variantRes = await fetch(
          `${API_URL}/variants/${exam_id}/student/${student_id}`
        );
        const variantData = await variantRes.json();

        // 3. Load questions for this variant
        const questionRes = await fetch(
          `${API_URL}/variants/${exam_id}/${variantData.id}/questions`
        );
        const questionData = await questionRes.json();
        setQuestions(questionData);

        // 4. Load student's submitted answers
        const studentRes = await fetch(
          `${API_URL}/students/${exam_id}/${student_id}`
        );
        const studentData = await studentRes.json();

        setStudentAnswers(
          studentData.answers.map((a: any) => ({
            questionId: a.questionId,
            response: Array.isArray(a.response) ? a.response : [a.response],
          }))
        );
      } catch (err) {
        console.error("Error loading exam data:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [examId, student_id]);

  // ---------------------------------------------------
  // Utils
  // ---------------------------------------------------
  const getAnswer = (qid: number) =>
    studentAnswers.find((a) => a.questionId === qid)?.response;

  const isCorrectAnswer = (q: Question, studentAnswer?: string[]) => {
    if (!studentAnswer || studentAnswer.length === 0) return false;

    if (q.type === "multiple_choice")
      return q.correctAnswers.includes(studentAnswer[0]);

    if (q.type === "multiple_correct") {
      const correct = new Set(q.correctAnswers);
      const user = new Set(studentAnswer);
      return (
        correct.size === user.size && [...correct].every((ans) => user.has(ans))
      );
    }

    if (q.type === "fill_blank" || q.type === "text_answer") {
      const userText = studentAnswer[0].toLowerCase().trim();
      return q.correctAnswers.some(
        (ans) => ans.toLowerCase().trim() === userText
      );
    }

    return false;
  };

  // ---------------------------------------------------
  // Loading / Not found
  // ---------------------------------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачаалж байна…
      </div>
    );

  if (!exam || questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ❌ Мэдээлэл олдсонгүй.
        <Link to="/team6/student" className="underline ml-3">
          Буцах
        </Link>
      </div>
    );

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <Link
          to={`/team6/exams/${exam_id}/students/${student_id}/result`}
          className="text-gray-600 hover:text-black"
        >
          ← Буцах
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-1">Таны хариултууд</h1>
        <p className="mb-6 text-gray-600">{exam.title}</p>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const studentAnswer = getAnswer(q.id);
            const correct = isCorrectAnswer(q, studentAnswer);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-xl border-2 ${
                  correct
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {i + 1}. {q.question}
                </h3>

                {/* Question image */}
                {q.image && (
                  <img className="w-72 rounded border mb-3" src={q.image} />
                )}

                {/* student's answer */}
                <div className="mb-3 text-sm">
                  <p className="font-medium text-gray-700">Таны хариулт:</p>
                  <p
                    className={`font-semibold ${
                      correct ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {studentAnswer?.length ? studentAnswer.join(", ") : "—"}
                  </p>
                </div>

                {/* correct answer */}
                {!correct && (
                  <div className="p-3 rounded border bg-white">
                    <p className="font-medium text-green-700">✓ Зөв хариулт:</p>
                    <p className="font-semibold text-green-800">
                      {q.correctAnswers.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to={`/team6/exams/${exam_id}/students/${student_id}/result`}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Үр дүн рүү буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
