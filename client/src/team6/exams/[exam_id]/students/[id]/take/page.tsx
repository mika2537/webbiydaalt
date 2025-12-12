import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function TakeExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const QUESTIONS_PER_PAGE = 2;

  const [questions, setQuestions] = useState({});
  const [questionIDs, setQuestionIDs] = useState([]);
  const [answers, setAnswers] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 min default

  // Load questions
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}/questions?student_id=${student_id}`
        );
        const data = await res.json();

        const ids = (data.items || []).map((q) => q.id);
        setQuestionIDs(ids);

        const mapped = {};
        (data.items || []).forEach((q) => {
          mapped[q.id] = {
            ...q,
            options: q.option || q.options || [],
          };
        });

        setQuestions(mapped);
      } catch (err) {
        console.error("Load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [exam_id, student_id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save answer
  const updateAnswer = async (qid, value) => {
    const newAns = { ...answers, [qid]: [value] };
    setAnswers(newAns);

    try {
      await fetch(`http://localhost:3001/api/lms/exams/${exam_id}/questions`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: String(qid),
          answer: value,
          student_id,
        }),
      });
    } catch (err) {
      console.error("Save error:", err);
    }

    setSavedMap((p) => ({ ...p, [qid]: true }));
    setTimeout(() => setSavedMap((p) => ({ ...p, [qid]: false })), 1400);
  };

  // Submit exam
  const handleSubmit = async () => {
    try {
      await fetch(`http://localhost:3001/api/lms/exams/${exam_id}/submit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id,
          answers: Object.entries(answers).map(([qid, value]) => ({
            id: String(qid),
            answer: value[0],
          })),
        }),
      });

      // Save local check page store
      await fetch(
        `http://localhost:3001/api/students/${exam_id}/${student_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: Object.entries(answers).map(([qid, value]) => ({
              questionId: Number(qid),
              response: value,
            })),
          }),
        }
      );
    } catch (err) {
      console.error("Submit failed:", err);
    }

    navigate(`/team6/exams/${exam_id}/students/${student_id}/check`);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        ⏳ Ачаалж байна...
      </div>
    );

  const start = page * QUESTIONS_PER_PAGE;
  const idsOnPage = questionIDs.slice(start, start + QUESTIONS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg px-4 py-2 text-xl font-bold text-red-600">
        ⏰ Үлдсэн хугацаа: {formatTime(timeLeft)}
      </div>
      {/* LEFT SIDEBAR (Quiz Navigation) */}
      <div className="w-60 bg-white shadow-md rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">Асуултын жагсаалт</h2>

        <div className="grid grid-cols-4 gap-2">
          {questionIDs.map((id, idx) => {
            const group = Math.floor(idx / QUESTIONS_PER_PAGE);
            const isActive = group === page;

            const answered = answers[id];

            return (
              <button
                key={id}
                onClick={() => setPage(group)}
                className={`p-2 text-sm rounded border transition ${
                  isActive
                    ? "bg-black text-white"
                    : answered
                    ? "bg-green-200"
                    : "bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Шалгалтын асуултууд</h1>

        {idsOnPage.map((id) => {
          const q = questions[id];
          const current = answers[id] || [];

          if (!q) return <div key={id}>⏳ Ачаалж байна...</div>;

          return (
            <div key={id} className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="font-semibold text-xl mb-4">{q.question}</h2>

              {q.type_id === 20 &&
                (q.options || []).map((opt, i) => (
                  <label
                    key={i}
                    className="flex gap-3 items-center mb-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${id}`}
                      checked={current[0] === opt}
                      onChange={() => updateAnswer(id, opt)}
                      className="w-5 h-5"
                    />
                    <span className="text-lg">{opt}</span>
                  </label>
                ))}

              {savedMap[id] && (
                <div className="text-green-600 mt-3 font-medium">
                  ✓ Хадгалагдлаа
                </div>
              )}
            </div>
          );
        })}

        {/* NAV BUTTONS */}
        <div className="flex justify-between mt-8">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            ◀ Өмнөх
          </button>

          {start + QUESTIONS_PER_PAGE >= questionIDs.length ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
              ✓ Шалгалт дуусгах
            </button>
          ) : (
            <button
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow"
            >
              Дараагийн ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
