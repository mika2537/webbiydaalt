import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function TakeExamPage() {
  const { examId, studentId } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://localhost:3001";

  const [exam, setExam] = useState<any>(null);
  const [variant, setVariant] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // -----------------------------
  // 🔥 1. Exam, Variant, Questions Fetch
  // -----------------------------
  useEffect(() => {
    async function load() {
      try {
        // 1. Exam Info
        const examRes = await fetch(`${API_URL}/exams/${examId}`);
        const examData = await examRes.json();
        setExam(examData);

        // 2. Fetch student's assigned variant OR random variant
        const variantRes = await fetch(
          `${API_URL}/variants/${examId}/student/${studentId}`
        );
        const variantData = await variantRes.json();
        setVariant(variantData);

        // 3. Fetch questions for variant
        const qRes = await fetch(
          `${API_URL}/variants/${examId}/${variantData.id}/questions`
        );
        const qData = await qRes.json();
        setQuestions(qData);

        // 4. Load local saved answers
        const saved = JSON.parse(
          sessionStorage.getItem(`exam_${examId}_answers`) || "{}"
        );
        setAnswers(saved);
      } catch (err) {
        console.error("Error loading exam", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [examId, studentId]);

  // -----------------------------
  // 🔥 2. Save Answers
  // -----------------------------
  const handleAnswerChange = (value: any) => {
    const q = questions[currentQuestion];
    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: value };
      sessionStorage.setItem(`exam_${examId}_answers`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleMultipleChange = (opt: string) => {
    const q = questions[currentQuestion];
    const old = answers[q.id] || [];

    const updatedArray = old.includes(opt)
      ? old.filter((o: string) => o !== opt)
      : [...old, opt];

    handleAnswerChange(updatedArray);
  };

  // -----------------------------
  // 🔥 3. Submit Exam
  // -----------------------------
  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const payload = Object.entries(answers).map(([qId, value]) => ({
      questionId: Number(qId),
      response: Array.isArray(value) ? value : [value],
    }));

    await fetch(`${API_URL}/students/${examId}/${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });

    navigate(`/team6/exams/${examId}/students/${studentId}/check`);
  };

  // -----------------------------
  // Loading / Error UI
  // -----------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачааллаж байна...
      </div>
    );

  if (!exam || questions.length === 0)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        ❌ Шалгалтын мэдээлэл олдсонгүй.
        <Link to="/team6/student" className="mt-4 underline">
          Буцах
        </Link>
      </div>
    );

  // -----------------------------
  // RENDER QUESTIONS
  // -----------------------------
  const q = questions[currentQuestion];
  const currentAnswer =
    answers[q.id] || (q.type === "multiple_correct" ? [] : "");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to={`/team6/exams/${examId}/students/${studentId}/start`}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Буцах
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Асуулт {currentQuestion + 1} / {questions.length}
            </span>
            <span>
              Хариулсан: {Object.keys(answers).length} / {questions.length}
            </span>
          </div>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-black h-2 rounded-full"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 rounded-lg shadow border mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {currentQuestion + 1}. {q.question}
          </h2>

          {q.image && (
            <img src={q.image} className="w-full rounded-lg border mb-4" />
          )}

          <div className="space-y-3">
            {/* MULTIPLE CHOICE */}
            {q.type === "multiple_choice" &&
              q.options?.map((opt: string, index: number) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer ${
                    currentAnswer === opt
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
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

            {/* MULTIPLE CORRECT */}
            {q.type === "multiple_correct" &&
              q.options?.map((opt: string, index: number) => (
                <label
                  key={index}
                  className={`block p-4 border-2 rounded-lg cursor-pointer ${
                    currentAnswer.includes(opt)
                      ? "border-black bg-gray-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={currentAnswer.includes(opt)}
                    onChange={() => handleMultipleChange(opt)}
                    className="mr-3"
                  />
                  {opt}
                </label>
              ))}

            {/* FILL BLANK */}
            {q.type === "fill_blank" && (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="w-full p-3 border rounded"
              />
            )}

            {/* TEXT ANSWER */}
            {q.type === "text_answer" && (
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                rows={6}
                className="w-full p-4 border rounded"
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() =>
              currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)
            }
            disabled={currentQuestion === 0}
            className="px-6 py-3 border rounded-lg disabled:opacity-50"
          >
            ← Өмнөх
          </button>

          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg"
            >
              Дуусгах ✓
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-black text-white rounded-lg"
            >
              Дараагийнх →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
