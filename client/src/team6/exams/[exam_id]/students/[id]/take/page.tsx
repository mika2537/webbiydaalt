import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Exam {
  id: number;
  name: string;
  description?: string;
  duration: number;
  total_point: number;
}

interface Question {
  id: number;
  question: string;
  type_id: number;
  options?: string[];
  option?: {
    options: string[];
  };
}

export default function TakeExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        console.log("Loading exam:", exam_id);

        // 1️⃣ Load exam info
        const examRes = await fetch(
          `http://localhost:3001/api/lms/exams/${exam_id}`
        );
        const examData = await examRes.json();
        setExam(examData);

        // 2️⃣ Load questions from backend database
        const examQuestionsRes = await fetch(
          `http://localhost:3001/api/exams/${exam_id}/questions`
        );
        const examQuestionsData = await examQuestionsRes.json();
        const questionRefs = Array.isArray(examQuestionsData)
          ? examQuestionsData
          : [];

        console.log("Exam questions from backend:", questionRefs);

        if (questionRefs.length === 0) {
          console.error("❌ No questions found for this exam");
          setLoading(false);
          return;
        }

        // 3️⃣ Load REAL QUESTION details from LMS for each question_id
        let finalQuestions = [];

        for (const ref of questionRefs) {
          const questionId = ref.question_id || ref.id;

          const qRes = await fetch(
            `http://localhost:3001/api/lms/questions/${questionId}`
          );

          const qData = await qRes.json();

          // Convert single question → array for uniform rendering
          const q = { ...qData };

          // Fix multiple-choice option field
          if (q.option && Array.isArray(q.option.options)) {
            q.options = q.option.options;
          }

          finalQuestions.push(q);
        }

        console.log("Final questions loaded:", finalQuestions.length);
        setQuestions(finalQuestions);
      } catch (err) {
        console.error("❌ Error loading exam:", err);
      }

      setLoading(false);
    }

    load();
  }, [exam_id]);

  // Save answer
  const updateAnswer = (qid: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: [value],
    }));
  };

  // Submit answers
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{exam.name}</h1>

        {questions.map((q, i) => {
          const current = answers[q.id] || [];

          return (
            <div key={q.id} className="bg-white p-5 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold mb-3">
                {i + 1}. {q.question}
              </h2>

              {/* TRUE / FALSE */}
              {q.type_id === 10 && (
                <>
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
                </>
              )}

              {/* MULTIPLE CHOICE */}
              {q.type_id === 20 &&
                q.options?.map((opt, idx) => (
                  <label key={idx} className="block mb-1">
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
          );
        })}

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            ✓ Шалгалт дуусгах
          </button>
        </div>
      </div>
    </div>
  );
}
