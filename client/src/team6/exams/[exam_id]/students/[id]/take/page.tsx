import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

/**
 * TakeExamPage.jsx
 * - Sidebar question navigation with check icons
 * - "Answer saved" green indicator for 1.5s after choosing
 * - Previous / Next buttons
 * - Active question detection via IntersectionObserver
 *
 * Note: adjust base URLs if needed.
 */

export default function TakeExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { [qid]: [value] }
  const [loading, setLoading] = useState(true);
  const [savedMap, setSavedMap] = useState({}); // { [qid]: true } shows "saved" indicator
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerRef = useRef(null);
  const observersRef = useRef(null);

  // ---------- Load exam & questions ----------
  useEffect(() => {
    async function load() {
      try {
        console.log("Loading exam:", exam_id);

        // 1) exam info
        const examRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}`
        );
        const examData = await examRes.json();
        setExam(examData);

        // 2) question groups
        const groupRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}/questions`
        );
        const groupData = await groupRes.json();
        const groups = groupData.items || [];

        // 3) real question details for each group.id
        const finalQuestions = [];
        for (const group of groups) {
          const qRes = await fetch(
            `http://localhost:3001/api/lms/questions/${group.id}`
          );
          const qData = await qRes.json();
          const q = { ...qData };
          if (q.option && Array.isArray(q.option.options))
            q.options = q.option.options;
          finalQuestions.push(q);
        }

        setQuestions(finalQuestions);
      } catch (err) {
        console.error("❌ Error loading exam:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [exam_id]);

  // ---------- IntersectionObserver to detect active question ----------
  useEffect(() => {
    if (!questions.length) return;

    // Clean up any previous observer
    if (observersRef.current) {
      observersRef.current.disconnect?.();
      observersRef.current = null;
    }

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // at least 50% visible to be active
    };

    const observer = new IntersectionObserver((entries) => {
      // find the most visible entry (largest intersectionRatio)
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const id = visible.target.getAttribute("data-qindex");
        const idx = Number(id);
        if (!Number.isNaN(idx)) setCurrentIndex(idx);
      }
    }, options);

    // observe each question element
    questions.forEach((_, idx) => {
      const el = document.getElementById(`question-${questions[idx].id}`);
      if (el) {
        el.setAttribute("data-qindex", String(idx));
        observer.observe(el);
      }
    });

    observersRef.current = observer;

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions]);

  // ---------- Helpers ----------
  const updateAnswer = (qid, value) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: [value],
    }));

    // Show saved indicator for 1.5s
    setSavedMap((prev) => ({ ...prev, [qid]: true }));
    setTimeout(() => {
      setSavedMap((prev) => ({ ...prev, [qid]: false }));
    }, 1500);
  };

  const goToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    const el = document.getElementById(`question-${questions[index].id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentIndex(index);
    }
  };

  const goNext = () =>
    goToQuestion(Math.min(currentIndex + 1, questions.length - 1));
  const goPrev = () => goToQuestion(Math.max(currentIndex - 1, 0));

  const handleSubmit = async () => {
    const payload = {
      answers: Object.entries(answers).map(([qid, response]) => ({
        questionId: Number(qid),
        response,
      })),
    };

    // original submit endpoint (keeps your earlier behavior)
    await fetch(`http://localhost:3001/api/students/${exam_id}/${student_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate(`/team6/exams/${exam_id}/students/${student_id}/check`);
  };

  // ---------- Render states ----------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        ⏳ Шалгалт ачаалж байна...
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        ❌ Шалгалт олдсонгүй.
        <Link to="/team6" className="underline mt-4 text-blue-600">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-2">
          <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold mb-3">Шалгалтын удирдлага</h3>

            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                const answered = Boolean(answers[q.id] && answers[q.id].length);
                const active = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-10 h-10 flex items-center justify-center rounded ${
                      answered
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    } ${
                      active ? "ring-2 ring-black" : "border border-gray-200"
                    }`}
                    title={`Асуулт ${idx + 1}`}
                  >
                    {answered ? "✔" : idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <div>
                Одоо: <strong>{currentIndex + 1}</strong> / {questions.length}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => goToQuestion(0)}
                  className="text-sm underline mr-2"
                >
                  Эхэнд
                </button>
                <button
                  onClick={() => goToQuestion(questions.length - 1)}
                  className="text-sm underline"
                >
                  Сүүлд
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-8" ref={containerRef}>
          <h1 className="text-3xl font-bold mb-6">{exam.name}</h1>

          {questions.map((q, i) => {
            const current = answers[q.id] || [];
            const isSaved = !!savedMap[q.id];

            return (
              <section
                key={q.id}
                id={`question-${q.id}`}
                className="bg-white p-6 rounded-lg shadow mb-8"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold mb-3">
                    {i + 1}. {q.question}
                  </h2>
                  <div className="text-sm text-gray-500">1.00 оноотой</div>
                </div>

                {/* TRUE / FALSE */}
                {q.type_id === 10 && (
                  <div className="mb-3">
                    <label className="block mb-2">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={current[0] === "true"}
                        onChange={() => updateAnswer(q.id, "true")}
                        className="mr-2"
                      />
                      Үнэн
                    </label>

                    <label className="block">
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        checked={current[0] === "false"}
                        onChange={() => updateAnswer(q.id, "false")}
                        className="mr-2"
                      />
                      Худал
                    </label>
                  </div>
                )}

                {/* MULTIPLE CHOICE */}
                {q.type_id === 20 && (
                  <div className="mb-3">
                    {q.options?.map((opt, idx) => (
                      <label key={idx} className="block mb-2">
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          checked={current[0] === opt}
                          onChange={() => updateAnswer(q.id, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                )}

                {/* Answer saved indicator */}
                {isSaved && (
                  <div className="inline-block mt-3 px-3 py-1 rounded bg-green-100 text-green-700 text-sm">
                    ✓ Хариулт хадгалагдлаа
                  </div>
                )}

                {/* Prev / Next buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => goPrev()}
                    disabled={i === 0}
                    className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                  >
                    ◀ Өмнөх
                  </button>

                  <div className="space-x-2">
                    <button
                      onClick={() => goToQuestion(i)}
                      className="px-4 py-2 rounded bg-gray-100"
                    >
                      Одоо харах
                    </button>
                    <button
                      onClick={() => goNext()}
                      disabled={i === questions.length - 1}
                      className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                    >
                      Дараагийн ▶
                    </button>
                  </div>
                </div>
              </section>
            );
          })}

          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              ✓ Шалгалт дуусгах
            </button>
          </div>
        </main>

        {/* Right small panel (optional) */}
        <aside className="col-span-2">
          <div className="sticky top-6 bg-white p-4 rounded-lg shadow">
            <h4 className="font-medium mb-3">Шалгалтын товчлуур</h4>
            <div className="text-sm text-gray-600 mb-2">
              Үлдсэн хугацаа: <strong>{duration}</strong>
            </div>
            <div className="text-sm">
              <button
                onClick={() => navigate(`/team6`)}
                className="text-blue-600 underline"
              >
                Буцах
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
