import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Question {
  id: number;
  question: string;
  type_id: number; // 10=true/false, 20=multiple choice
  level_id: number;
  options: string[];
}

interface QuestionsMap {
  [key: number]: Question;
}

interface AnswersMap {
  [key: number]: string;
}

interface SavedMap {
  [key: number]: boolean;
}

export default function TakeExamPage() {
  const { exam_id, id } = useParams();
  const navigate = useNavigate();

  const QUESTIONS_PER_PAGE = 2;

  const [questions, setQuestions] = useState<QuestionsMap>({});
  const [questionIDs, setQuestionIDs] = useState<number[]>([]);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [savedMap, setSavedMap] = useState<SavedMap>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [examInfo, setExamInfo] = useState<any>(null);

  // ============================================================
  // 1) LOAD DATA
  // ============================================================
  useEffect(() => {
    async function load() {
      try {
        // exam info
        const examRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}`
        );
        const examData = await examRes.json();
        setExamInfo(examData);

        if (examData?.duration) {
          setTimeLeft(examData.duration * 60);
        }

        // questions
        const qRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}/questions?student_id=${id}`
        );
        const qData = await qRes.json();

        const ids = qData.items?.map((q: any) => q.id) || [];
        setQuestionIDs(ids);

        const map: QuestionsMap = {};
        qData.items?.forEach((q: any) => {
          map[q.id] = {
            ...q,
            options: q.option || q.options || [],
          };
        });

        setQuestions(map);
      } catch (err) {
        console.error("LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [exam_id, id]);

  // ============================================================
  // 2) TIMER
  // ============================================================
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ============================================================
  // FORMAT BUILDER
  // ============================================================
  function buildAnswer(q: Question, value: boolean | number) {
    // TRUE / FALSE
    if (q.type_id === 10) return String(value);

    // MULTIPLE CHOICE
    if (q.type_id === 20) {
      return JSON.stringify(
        q.options.map((_, idx) => (idx === value ? 100 : 0))
      );
    }

    return String(value);
  }

  // ============================================================
  // 3) UPDATE ANSWER + AUTO SAVE
  // ============================================================
  async function updateAnswer(qid: number, value: boolean | number) {
    const q = questions[qid];
    if (!q) return;

    const formatted = buildAnswer(q, value);

    setAnswers((prev) => ({ ...prev, [qid]: formatted }));

    try {
      await fetch(
        `http://localhost:3001/api/lms/users/me/exams/${exam_id}/questions`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: qid, answer: formatted }),
        }
      );
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }

    setSavedMap((p) => ({ ...p, [qid]: true }));
    setTimeout(() => setSavedMap((p) => ({ ...p, [qid]: false })), 1000);
  }

  // ============================================================
  // 4) SUBMIT
  // ============================================================
  async function handleSubmit() {
    try {
      const payload = Object.entries(answers).map(([qid, value]) => {
        const q = questions[Number(qid)];
        return {
          id: Number(qid),
          answer: q?.type_id === 10 ? value === "true" : value,
        };
      });

      await fetch(`http://localhost:3001/api/lms/users/me/exams/${exam_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("SUBMIT ERROR:", err);
    }

    navigate(`/team6/exams/${exam_id}/students/${id}/result`);
  }

  // ============================================================
  // HELPERS
  // ============================================================
  const formatTime = (t: number) =>
    `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;

  const getLevelName = (levelId: number): string => {
    const map: any = {
      10: "Амархан",
      20: "Амархан",
      30: "Дунд",
      40: "Дунд",
      50: "Хэцүү",
      60: "Хэцүү",
    };
    return map[levelId] || "Тодорхойгүй";
  };

  const getLevelColor = (levelId: number): string => {
    if (levelId <= 20) return "bg-green-100 text-green-700";
    if (levelId <= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        ⏳ Ачаалж байна...
      </div>
    );
  }

  // ============================================================
  // PAGINATION
  // ============================================================
  const start = page * QUESTIONS_PER_PAGE;
  const idsOnPage = questionIDs.slice(start, start + QUESTIONS_PER_PAGE);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      {/* LEFT PANEL */}
      <div className="w-60 bg-white shadow-md rounded-lg p-4">
        <h2 className="font-bold text-lg mb-3">Асуултын жагсаалт</h2>
        <p className="text-sm text-gray-500 mb-3">Нийт: {questionIDs.length}</p>

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

        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span>Хариулсан</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Хариулаагүй</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {examInfo?.name || "Шалгалтын асуултууд"}
          </h1>

          <div
            className={`text-2xl font-extrabold px-4 py-2 rounded-lg ${
              timeLeft < 60
                ? "bg-red-600 text-white animate-pulse"
                : timeLeft < 300
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            ⏰ {formatTime(timeLeft)}
          </div>
        </div>

        {/* QUESTIONS */}
        {idsOnPage.map((id, index) => {
          const q = questions[id];
          const current = answers[id];
          const num = start + index + 1;

          return (
            <div key={id} className="bg-white p-6 rounded-xl shadow mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="font-semibold text-xl">
                  {num}. {q.question}
                </h2>
                {q.level_id && (
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                      q.level_id
                    )}`}
                  >
                    {getLevelName(q.level_id)}
                  </span>
                )}
              </div>

              {/* TRUE / FALSE */}
              {q.type_id === 10 && (
                <div className="flex gap-4">
                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      current === "true"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => updateAnswer(id, true)}
                  >
                    ✓ Үнэн (True)
                  </button>

                  <button
                    className={`px-6 py-3 rounded-lg font-medium transition ${
                      current === "false"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => updateAnswer(id, false)}
                  >
                    ✗ Худал (False)
                  </button>
                </div>
              )}

              {/* MULTIPLE CHOICE */}
              {q.type_id === 20 &&
                q.options.map((opt, i) => {
                  const val = JSON.stringify(
                    q.options.map((_, idx) => (idx === i ? 100 : 0))
                  );

                  const checked = current === val;

                  return (
                    <label
                      key={i}
                      className={`flex gap-3 items-center mb-3 p-3 rounded-lg cursor-pointer transition ${
                        checked
                          ? "bg-blue-50 border-2 border-blue-500"
                          : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${id}`}
                        checked={checked}
                        onChange={() => updateAnswer(id, i)}
                        className="w-5 h-5"
                      />
                      <span className="text-lg">{opt}</span>
                    </label>
                  );
                })}

              {savedMap[id] && (
                <div className="text-green-600 mt-3 flex items-center gap-2">
                  <span className="animate-pulse">✓</span> Хадгалагдлаа
                </div>
              )}
            </div>
          );
        })}

        {/* FOOTER NAV */}
        <div className="flex justify-between mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="px-5 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition"
          >
            ◀ Өмнөх
          </button>

          <div className="text-gray-500">
            Хуудас {page + 1} /{" "}
            {Math.ceil(questionIDs.length / QUESTIONS_PER_PAGE)}
          </div>

          {start + QUESTIONS_PER_PAGE >= questionIDs.length ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
            >
              ✓ Шалгалт дуусгах
            </button>
          ) : (
            <button
              onClick={() => setPage(page + 1)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Дараагийн ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
