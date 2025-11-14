"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  mockExams,
  mockVariants,
  mockQuestionBank,
} from "../../../../../data/mockData";

interface StudentAnswer {
  questionId: number;
  response: string[] | string;
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
  const { examId, studentId } = useParams();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const foundExam = mockExams.find((e) => e.id === Number(examId));
      if (!foundExam) return setLoading(false);

      setExam(foundExam);

      const variant = mockVariants.find(
        (v) => String(v.examId) === String(examId)
      );

      if (!variant) return setLoading(false);

      const examQuestions = variant.questionIds
        .map((qid: number) => mockQuestionBank.find((q) => q.id === qid))
        .filter(Boolean) as Question[];

      setQuestions(examQuestions);

      const fromLocal = JSON.parse(
        sessionStorage.getItem(`exam_${examId}_answers`) || "{}"
      );

      const parsed = Object.entries(fromLocal).map(
        ([questionId, resp]: any) => ({
          questionId: Number(questionId),
          response: Array.isArray(resp) ? resp : [resp],
        })
      );

      setStudentAnswers(parsed);

      setLoading(false);
    };

    loadData();
  }, [examId, studentId]);

  const getAnswer = (qid: number) =>
    studentAnswers.find((a) => a.questionId === qid)?.response;

  const isCorrectAnswer = (q: Question, studentAnswer: any) => {
    if (!studentAnswer) return false;

    if (q.type === "multiple_choice")
      return q.correctAnswers.includes(studentAnswer);

    if (q.type === "multiple_correct") {
      const correctSet = new Set(q.correctAnswers);
      const studentSet = new Set(studentAnswer);
      return (
        correctSet.size === studentSet.size &&
        [...correctSet].every((ans) => studentSet.has(ans))
      );
    }

    if (q.type === "fill_blank" || q.type === "text_answer") {
      const lower = String(studentAnswer).toLowerCase().trim();
      return q.correctAnswers.some((ans) => ans.toLowerCase().trim() === lower);
    }

    return false;
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <Link
          to={`/team6/exams/${examId}/students/${studentId}/result`}
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

                {q.image && (
                  <img className="w-72 rounded border mb-3" src={q.image} />
                )}

                {/* student answer */}
                <div className="mb-3 text-sm">
                  <p className="font-medium text-gray-700">Таны хариулт:</p>
                  <p
                    className={`font-semibold ${
                      correct ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {Array.isArray(studentAnswer)
                      ? studentAnswer.join(", ")
                      : studentAnswer || "—"}
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
            to={`/team6/exams/${examId}/students/${studentId}/result`}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Үр дүн рүү буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
