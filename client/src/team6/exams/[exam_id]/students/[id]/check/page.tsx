import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function CheckExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const cacheKeyQuestions = `exam_${exam_id}_questions`;
  const cacheKeyAnswers = `exam_${exam_id}_answers`;

  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Load from LocalStorage
  useEffect(() => {
    const q = localStorage.getItem(cacheKeyQuestions);
    const a = localStorage.getItem(cacheKeyAnswers);

    if (q) setQuestions(JSON.parse(q));
    if (a) setAnswers(JSON.parse(a));

    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        ⏳ Хариултууд ачаалж байна...
      </div>
    );

  const questionList = Object.values(questions);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <Link
          to={`/team6/exams/${exam_id}`}
          className="text-gray-600 hover:text-black"
        >
          ← Буцах
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-2">Таны хариултууд</h1>
        <p className="text-gray-600 mb-6">Шалгалтын дугаар: {exam_id}</p>

        <div className="space-y-6">
          {questionList.map((q: any, index: number) => {
            const ans = answers[q.id] || [];

            return (
              <div key={q.id} className="p-5 rounded-xl border bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">
                  {index + 1}. {q.question}
                </h3>

                {q.image && (
                  <img src={q.image} className="w-72 border rounded mb-3" />
                )}

                <p className="text-sm font-medium text-gray-700">
                  Таны хариулт:
                </p>
                <p className="text-lg font-semibold text-blue-700">
                  {ans.length ? ans.join(", ") : "—"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() =>
              navigate(`/team6/exams/${exam_id}/students/${student_id}/result`)
            }
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Үр дүн рүү шилжих
          </button>
        </div>
      </div>
    </div>
  );
}
