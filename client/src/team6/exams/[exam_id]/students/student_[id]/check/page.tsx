"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  mockExams,
  mockQuestionBank,
  mockStudentExams,
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
  const { exam_id, id } = useParams<{ exam_id: string; id: string }>();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockData = () => {
      const foundExam = mockExams.find((e) => e.id === Number(exam_id));
      const foundStudentExam = mockStudentExams.find(
        (s) => s.examId === Number(exam_id) && s.studentId === Number(id)
      );

      if (!foundExam || !foundStudentExam) {
        console.warn("⚠️ Exam or student exam not found");
        setLoading(false);
        return;
      }

      // Get related questions for this exam (via topics)
      const topicIds =
        foundExam.selectedTopics?.map((t: any) => t.topicId) || [];
      const relatedQuestions = mockQuestionBank.filter((q) =>
        topicIds.includes(q.topicId)
      );

      setExam(foundExam);
      setQuestions(relatedQuestions);
      setStudentAnswers(foundStudentExam.answers || []);
      setLoading(false);
    };

    loadMockData();
  }, [exam_id, id]);

  const getStudentAnswer = (questionId: number) => {
    return studentAnswers.find((a) => a.questionId === questionId)?.response;
  };

  const checkAnswer = (question: Question, studentAnswer: any) => {
    if (!studentAnswer) return false;

    const correctAnswers = question.correctAnswers || [];

    if (question.type === "multiple_choice") {
      return correctAnswers.includes(studentAnswer);
    }

    if (question.type === "multiple_correct") {
      const correctSet = new Set(correctAnswers);
      const studentSet = new Set(studentAnswer);
      return (
        correctSet.size === studentSet.size &&
        [...correctSet].every((ans) => studentSet.has(ans))
      );
    }

    if (question.type === "fill_blank" || question.type === "text_answer") {
      const lower = String(studentAnswer).toLowerCase().trim();
      return correctAnswers.some((ans) => ans.toLowerCase().trim() === lower);
    }

    return false;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );

  if (!exam || questions.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        ❌ Мэдээлэл олдсонгүй.
        <Link
          href="/team6/student"
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
        <div className="mb-8">
          <Link
            href={`/team6/exams/${exam_id}/students/student_${id}/result`}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
          >
            ← Буцах
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Зөв хариултууд
          </h1>
          <p className="text-gray-600">
            {exam.title} — {questions.length} асуулт
          </p>
        </div>

        {/* Question list */}
        <div className="space-y-6">
          {questions.map((q, index) => {
            const studentAnswer = getStudentAnswer(q.id);
            const isCorrect = checkAnswer(q, studentAnswer);

            return (
              <div
                key={q.id}
                className={`p-6 border-2 rounded-lg ${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="bg-black text-white px-3 py-1 rounded-lg font-bold text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {q.question}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {q.type === "multiple_choice" && "☑️ Нэг сонголт"}
                        {q.type === "multiple_correct" && "✅ Олон сонголт"}
                        {q.type === "fill_blank" && "✍️ Нөхөх"}
                        {q.type === "text_answer" && "📝 Текст"}
                      </span>
                      <span>Оноо: {q.marks || 5}</span>
                    </div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-full font-semibold text-sm ${
                      isCorrect
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {isCorrect ? "✓ Зөв" : "✗ Буруу"}
                  </span>
                </div>

                {q.image && (
                  <img
                    src={q.image}
                    alt="Асуултын зураг"
                    className="w-72 rounded-md border mb-3"
                  />
                )}

                {/* Student Answer */}
                <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Таны хариулт:</p>
                  <div
                    className={`font-medium ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {Array.isArray(studentAnswer)
                      ? studentAnswer.join(", ")
                      : studentAnswer || "—"}
                  </div>
                </div>

                {/* Correct Answer */}
                {!isCorrect && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm text-green-700 font-medium mb-1">
                      ✓ Зөв хариулт:
                    </div>
                    <div className="font-semibold text-green-800">
                      {q.correctAnswers.join(", ")}
                    </div>
                  </div>
                )}

                {/* Options */}
                {q.options && (
                  <div className="mt-4 space-y-2">
                    {q.options.map((option, idx) => {
                      const studentSelected = Array.isArray(studentAnswer)
                        ? studentAnswer.includes(option)
                        : studentAnswer === option;
                      const correctOption = q.correctAnswers.includes(option);

                      return (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border-2 ${
                            correctOption
                              ? "border-green-300 bg-green-50"
                              : studentSelected
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {correctOption && (
                              <span className="text-green-600">✓</span>
                            )}
                            {studentSelected && !correctOption && (
                              <span className="text-red-600">✗</span>
                            )}
                            <span className="text-gray-800">{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-center">
          <Link
            href={`/team6/exams/${exam_id}/students/student_${id}/result`}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Үр дүн рүү буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
