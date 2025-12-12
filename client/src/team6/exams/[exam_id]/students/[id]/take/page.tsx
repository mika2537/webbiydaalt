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
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  // 1) Load questions
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
      } catch (e) {
        console.error("Load error:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [exam_id, student_id]);

  // 2) Timer
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((p) => (p > 0 ? p - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // LMS FORMAT BUILDER
  function buildAnswerFormat(q, indexOrValue) {
    if (q.type_id === 10) {
      return indexOrValue.toString(); // boolean → "true" / "false"
    }

    if (q.type_id === 20) {
      const count = q.options.length;
      const arr = Array(count).fill(0);
      arr[indexOrValue] = 100;
      return JSON.stringify(arr); // "[100,0,0]"
    }

    return indexOrValue;
  }

  // 3) UPDATE ANSWER
  const updateAnswer = async (qid, value) => {
    const q = questions[qid];
    if (!q) return;

    const formatted = buildAnswerFormat(q, value);

    setAnswers((p) => ({ ...p, [qid]: formatted }));

    try {
      await fetch(
        `https://todu.mn/bs/lms/v1/users/me/exams/${exam_id}/questions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_LMS_TOKEN}`,
          },
          body: JSON.stringify({
            id: qid,
            answer: formatted,
          }),
        }
      );
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }

    setSavedMap((p) => ({ ...p, [qid]: true }));
    setTimeout(() => setSavedMap((p) => ({ ...p, [qid]: false })), 1400);
  };

  // 4) SUBMIT
  const handleSubmit = async () => {
    try {
      // Local result store
      await fetch(
        `http://localhost:3001/api/students/${exam_id}/${student_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: Object.entries(answers).map(([qid, value]) => ({
              questionId: Number(qid),
              response: [value],
            })),
          }),
        }
      );
    } catch (err) {
      console.error("Submit error:", err);
    }

    navigate(`/team6/exams/${exam_id}/students/${student_id}/check`);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
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
      {/* LEFT SIDE PANEL */}
      <div className="w-60 bg-white shadow-md rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">Асуултын жагсаалт</h2>

        <div className="grid grid-cols-4 gap-2">
          {questionIDs.map((id, idx) => {
            const group = Math.floor(idx / QUESTIONS_PER_PAGE);
            const active = group === page;

            return (
              <button
                key={id}
                onClick={() => setPage(group)}
                className={`p-2 text-sm rounded border ${
                  active
                    ? "bg-black text-white"
                    : answers[id]
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
        <h1 className="text-3xl font-bold mb-4">Шалгалтын асуултууд</h1>
        <h2 className="text-3xl font-extrabold text-red-600 mb-6">
          ⏰ ҮЛДСЭН ХУГАЦАА: {formatTime(timeLeft)}
        </h2>

        {idsOnPage.map((id) => {
          const q = questions[id];
          const current = answers[id];

          return (
            <div key={id} className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="font-semibold text-xl mb-4">{q.question}</h2>

              {/* TRUE / FALSE */}
              {q.type_id === 10 && (
                <div className="flex gap-4">
                  <button
                    className={`px-4 py-2 rounded ${
                      current === "true"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => updateAnswer(id, true)}
                  >
                    True
                  </button>
                  <button
                    className={`px-4 py-2 rounded ${
                      current === "false"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                    onClick={() => updateAnswer(id, false)}
                  >
                    False
                  </button>
                </div>
              )}

              {/* MULTIPLE CHOICE */}
              {q.type_id === 20 &&
                q.options.map((opt, i) => (
                  <label
                    key={i}
                    className="flex gap-3 items-center mb-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q-${id}`}
                      checked={
                        current ===
                        JSON.stringify(
                          Array(q.options.length)
                            .fill(0)
                            .map((_, idx) => (idx === i ? 100 : 0))
                        )
                      }
                      onChange={() => updateAnswer(id, i)}
                      className="w-5 h-5"
                    />
                    <span className="text-lg">{opt}</span>
                  </label>
                ))}

              {savedMap[id] && (
                <div className="text-green-600 mt-3">✓ Хадгалагдлаа</div>
              )}
            </div>
          );
        })}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-10">
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
