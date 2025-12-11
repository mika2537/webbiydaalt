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

  // Save locally + send single answer to backend proxy which forwards to LMS
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

  // Finish: POST local submit (backend forwards to LMS)
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
      // Also save locally for check page (optional)
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

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        ⏳ Ачаалж байна...
      </div>
    );

  const start = page * QUESTIONS_PER_PAGE;
  const idsOnPage = questionIDs.slice(start, start + QUESTIONS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-5">Шалгалт</h1>

        <div className="mb-4 grid grid-cols-5 gap-2">
          {questionIDs.map((id, idx) => {
            const isActive = Math.floor(idx / QUESTIONS_PER_PAGE) === page;
            return (
              <button
                key={id}
                onClick={() => setPage(Math.floor(idx / QUESTIONS_PER_PAGE))}
                className={`p-2 rounded ${
                  isActive ? "bg-black text-white" : "bg-gray-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {idsOnPage.map((id) => {
          const q = questions[id];
          const current = answers[id] || [];

          if (!q) return <div key={id}>⏳ Ачаалж байна...</div>;

          return (
            <div key={id} className="bg-white p-5 rounded-lg shadow mb-6">
              <h2 className="font-semibold text-xl mb-3">{q.question}</h2>

              {q.type_id === 20 &&
                (q.options || []).map((opt, i) => (
                  <label key={i} className="flex gap-2 items-center mb-2">
                    <input
                      type="radio"
                      name={`q-${id}`}
                      checked={current[0] === opt}
                      onChange={() => updateAnswer(id, opt)}
                    />
                    {opt}
                  </label>
                ))}

              {savedMap[id] && (
                <div className="text-green-600 mt-2">✓ Хадгалагдлаа</div>
              )}
            </div>
          );
        })}

        <div className="flex justify-between mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            ◀ Өмнөх
          </button>

          {start + QUESTIONS_PER_PAGE >= questionIDs.length ? (
            <button
              className="px-6 py-2 bg-black text-white rounded"
              onClick={handleSubmit}
            >
              ✓ Шалгалт дуусгах
            </button>
          ) : (
            <button
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Дараагийн ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
