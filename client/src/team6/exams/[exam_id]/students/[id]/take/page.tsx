import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function TakeExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const QUESTIONS_PER_PAGE = 2;

  const [exam, setExam] = useState(null);
  const [questionIDs, setQuestionIDs] = useState([]); // ← only IDs
  const [questions, setQuestions] = useState({}); // cached questions
  const [answers, setAnswers] = useState({});
  const [savedMap, setSavedMap] = useState({});
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // -----------------------
  // Helpers
  // -----------------------

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const cacheKeyQuestions = `exam_${exam_id}_questions`;
  const cacheKeyAnswers = `exam_${exam_id}_answers`;

  // -----------------------
  // Load Exam + IDs + Restore Cache
  // -----------------------
  useEffect(() => {
    async function load() {
      try {
        // Restore cached questions and answers
        const cachedQ = localStorage.getItem(cacheKeyQuestions);
        const cachedAns = localStorage.getItem(cacheKeyAnswers);

        if (cachedQ) {
          setQuestions(JSON.parse(cachedQ));
        }
        if (cachedAns) {
          setAnswers(JSON.parse(cachedAns));
        }

        // 1) Load exam info
        const examRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}`
        );
        const examData = await examRes.json();
        setExam(examData);

        // 2) Load only question IDs
        const groupRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}/questions`
        );
        const groupData = await groupRes.json();
        const ids = (groupData.items || []).map((g) => g.id);

        setQuestionIDs(ids);
        setLoading(false);
      } catch (err) {
        console.error("❌ Load error:", err);
        setLoading(false);
      }
    }

    load();
  }, [exam_id]);

  // -----------------------
  // Lazy Load Question By ID
  // -----------------------
  const loadQuestionLazy = async (id) => {
    if (questions[id]) return; // Already cached

    try {
      const res = await fetch(`http://localhost:3001/api/lms/questions/${id}`);
      const qData = await res.json();

      const formatted = {
        ...qData,
        options: qData.option?.options || [],
      };

      const newCache = { ...questions, [id]: formatted };
      setQuestions(newCache);
      localStorage.setItem(cacheKeyQuestions, JSON.stringify(newCache));
    } catch (err) {
      console.error("❌ Failed load question", id, err);
    }
  };

  // When page changes → load 2 questions for that page
  useEffect(() => {
    const start = page * QUESTIONS_PER_PAGE;
    const idsToLoad = questionIDs.slice(start, start + QUESTIONS_PER_PAGE);

    idsToLoad.forEach((id) => loadQuestionLazy(id));
  }, [page, questionIDs]);

  // -----------------------
  // TIMER SYSTEM
  // -----------------------
  useEffect(() => {
    if (!exam?.duration) return;

    const totalSeconds = exam.duration * 60;
    setTimeLeft(totalSeconds);

    let timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [exam]);

  // -----------------------
  // Save answer + cache
  // -----------------------
  const updateAnswer = (qid, value) => {
    const newAns = { ...answers, [qid]: [value] };
    setAnswers(newAns);

    localStorage.setItem(cacheKeyAnswers, JSON.stringify(newAns));

    setSavedMap((prev) => ({ ...prev, [qid]: true }));
    setTimeout(() => {
      setSavedMap((prev) => ({ ...prev, [qid]: false }));
    }, 1500);
  };

  // -----------------------
  // Pagination
  // -----------------------
  const start = page * QUESTIONS_PER_PAGE;
  const end = start + QUESTIONS_PER_PAGE;
  const idsOnPage = questionIDs.slice(start, end);
  const totalPages = Math.ceil(questionIDs.length / QUESTIONS_PER_PAGE);

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([qid, response]) => ({
        questionId: Number(qid),
        response,
      })),
    };

    await fetch(`http://localhost:3001/api/students/${exam_id}/${student_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate(`/team6/exams/${exam_id}/students/${student_id}/check`);
  };

  // -----------------------
  // UI
  // -----------------------
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        ⏳ Шалгалт ачаалж байна...
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        ❌ Шалгалт олдсонгүй.
        <Link className="underline" to="/team6">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <aside className="col-span-2">
          <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Асуултын жагсаалт</h3>

            <div className="grid grid-cols-4 gap-2">
              {questionIDs.map((id, idx) => {
                const answered = answers[id];
                const isActive = Math.floor(idx / QUESTIONS_PER_PAGE) === page;

                return (
                  <button
                    key={id}
                    onClick={() =>
                      setPage(Math.floor(idx / QUESTIONS_PER_PAGE))
                    }
                    className={`w-10 h-10 flex items-center justify-center rounded
                      ${answered ? "bg-blue-600 text-white" : "bg-gray-200"}
                      ${isActive ? "ring-2 ring-black" : ""}`}
                  >
                    {answered ? "✔" : idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-700">
              Хугацаа:
              <strong className="ml-2 text-red-600">
                {formatTime(timeLeft)}
              </strong>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-span-8">
          <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>

          {idsOnPage.map((id) => {
            const q = questions[id];
            if (!q) return <div key={id}>⏳ Ачаалж байна...</div>;

            const current = answers[id] || [];
            const saved = savedMap[id];

            return (
              <div key={id} className="bg-white p-6 shadow rounded-lg mb-6">
                <h2 className="font-semibold text-lg mb-3">{q.question}</h2>

                {/* TRUE / FALSE */}
                {q.type_id === 10 && (
                  <>
                    <label className="block mb-2">
                      <input
                        type="radio"
                        name={`q-${id}`}
                        checked={current[0] === "true"}
                        onChange={() => updateAnswer(id, "true")}
                      />
                      Үнэн
                    </label>

                    <label className="block mb-2">
                      <input
                        type="radio"
                        name={`q-${id}`}
                        checked={current[0] === "false"}
                        onChange={() => updateAnswer(id, "false")}
                      />
                      Худал
                    </label>
                  </>
                )}

                {/* MULTIPLE CHOICE */}
                {q.type_id === 20 &&
                  q.options?.map((opt, i) => (
                    <label key={i} className="block mb-2">
                      <input
                        type="radio"
                        name={`q-${id}`}
                        checked={current[0] === opt}
                        onChange={() => updateAnswer(id, opt)}
                      />
                      {opt}
                    </label>
                  ))}

                {saved && (
                  <div className="mt-3 text-green-600 text-sm">
                    ✓ Хариулт хадгалагдлаа
                  </div>
                )}
              </div>
            );
          })}

          {/* PAGE CONTROLS */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              ◀ Өмнөх
            </button>

            {end >= questionIDs.length ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded"
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
        </main>

        {/* RIGHT PANEL */}
        <aside className="col-span-2">
          <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium">Туслах цэс</h4>
            <div className="text-sm mt-2">
              Шалгалтын үргэлжлэх хугацаа:{" "}
              <strong>{exam.duration} минут</strong>
            </div>

            <button
              onClick={() => navigate("/team6")}
              className="mt-4 underline text-blue-600"
            >
              Буцах
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
