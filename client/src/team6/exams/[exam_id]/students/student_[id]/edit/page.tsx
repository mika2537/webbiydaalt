"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchData } from "../../../../../../utils/fetchData";

const BASE_URL = "https://todu.mn/bs/lms/v1";

export default function TakeExamPage() {
  const { exam_id, student_id } = useParams<{
    exam_id: string;
    student_id: string;
  }>();
  const router = useRouter();

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load exam and questions
  useEffect(() => {
    const loadExamData = async () => {
      try {
        const [examData, questionData] = await Promise.all([
          fetchData(`${BASE_URL}/exams/${exam_id}`, "GET"),
          fetchData(`${BASE_URL}/exams/${exam_id}/questions`, "GET"),
        ]);

        setExam(examData);
        setQuestions(questionData || []);
        setTimeRemaining((examData?.duration || 30) * 60);

        // Restore saved answers
        const saved = JSON.parse(
          sessionStorage.getItem(`exam_${exam_id}_answers`) || "{}"
        );
        setAnswers(saved);
      } catch (error) {
        console.error("⚠️ Failed to load exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExamData();
  }, [exam_id]);

  // Timer countdown
  useEffect(() => {
    if (!exam) return;

    const startTimeKey = `exam_${exam_id}_start_time`;
    let startTime = Number(sessionStorage.getItem(startTimeKey));
    if (!startTime) {
      startTime = Date.now();
      sessionStorage.setItem(startTimeKey, String(startTime));
    }

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const durationSeconds = (exam.duration || 30) * 60;
      const remaining = Math.max(durationSeconds - elapsed, 0);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exam]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (answer: any) => {
    const q = questions[currentQuestion];
    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: answer };
      sessionStorage.setItem(
        `exam_${exam_id}_answers`,
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const handleMultipleChange = (option: string) => {
    const q = questions[currentQuestion];
    const current = answers[q.id] || [];
    const newAnswers = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];

    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: newAnswers };
      sessionStorage.setItem(
        `exam_${exam_id}_answers`,
        JSON.stringify(updated)
      );
      return updated;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    try {
      if (
        Object.keys(answers).length < questions.length &&
        !window.confirm("Та бүх асуултад хариулаагүй байна. Илгээх үү?")
      ) {
        setSubmitting(false);
        return;
      }

      await fetchData(
        `${BASE_URL}/students/${student_id}/exams/${exam_id}/submit`,
        "POST",
        { answers }
      );

      sessionStorage.removeItem(`exam_${exam_id}_answers`);
      router.push(`/team6/exams/${exam_id}/students/${student_id}/result`);
    } catch (error) {
      console.error("❌ Failed to submit exam:", error);
      alert("Шалгалт илгээхэд алдаа гарлаа.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );

  if (!exam || questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Шалгалтын мэдээлэл олдсонгүй.
        <Link href="/team6/student" className="mt-4 text-black underline">
          Буцах
        </Link>
      </div>
    );

  const q = questions[currentQuestion];
  const currentAnswer =
    answers[q.id] || (q.type === "multiple_correct" ? [] : "");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            href={`/team6/exams/${exam_id}/students/${student_id}/start`}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Буцах
          </Link>
          <div className="text-2xl font-semibold text-gray-800">
            ⏱️ {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Асуулт {currentQuestion + 1} / {questions.length}
            </span>
            <span>
              Хариулсан: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion + 1}. {q.question}
          </h2>
          {q.image && (
            <img
              src={q.image}
              alt="Асуултын зураг"
              className="w-full rounded-lg mb-4 border"
            />
          )}

          <div className="space-y-3">
            {q.type === "multiple_choice" &&
              q.options?.map((opt: string, i: number) => (
                <label
                  key={i}
                  className={`block p-4 border-2 rounded-lg cursor-pointer ${
                    currentAnswer === opt
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={opt}
                    checked={currentAnswer === opt}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    className="mr-3"
                  />
                  {opt}
                </label>
              ))}

            {q.type === "multiple_correct" &&
              q.options?.map((opt: string, i: number) => (
                <label
                  key={i}
                  className={`block p-4 border-2 rounded-lg cursor-pointer ${
                    currentAnswer.includes(opt)
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={currentAnswer.includes(opt)}
                    onChange={() => handleMultipleChange(opt)}
                    className="mr-3"
                  />
                  {opt}
                </label>
              ))}

            {q.type === "fill_blank" && (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-black outline-none"
                placeholder="Хариултаа бичнэ үү..."
              />
            )}

            {q.type === "text_answer" && (
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-black outline-none resize-none"
                rows={6}
                placeholder="Хариултаа энд бичнэ үү..."
              />
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            ← Өмнөх
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Дуусгах ✓
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Дараагийнх →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
