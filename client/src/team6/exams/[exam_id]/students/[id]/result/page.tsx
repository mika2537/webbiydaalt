import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function CheckExamPage() {
  const { exam_id, student_id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [studentAnswers, setStudentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:3001/api/lms";
  const API_STUDENT = "http://localhost:3001/api/students";

  useEffect(() => {
    async function load() {
      try {
        // 1) exam info
        const resExam = await fetch(`${API}/exams/${exam_id}`);
        const examData = await resExam.json();
        setExam(examData);

        // 2) question groups
        const resGroup = await fetch(`${API}/exams/${exam_id}/questions`);
        const groups = await resGroup.json();

        // 3) load real questions
        const fullQuestions = [];
        for (const g of groups.items) {
          const qRes = await fetch(`${API}/questions/${g.id}`);
          const qData = await qRes.json();

          fullQuestions.push({
            id: qData.id,
            question: qData.question,
            options: qData.option?.options || [],
            type_id: qData.type_id,
            image: qData.image || null,
          });
        }

        setQuestions(fullQuestions);

        // 4) load student's submitted answers
        const resStu = await fetch(`${API_STUDENT}/${exam_id}/${student_id}`);
        const stuData = await resStu.json();

        setStudentAnswers(stuData.answers || []);
      } catch (e) {
        console.error("Check page load error:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [exam_id, student_id]);

  const getAnswer = (qid) => {
    const a = studentAnswers.find((x) => x.questionId === qid);
    return a ? a.response : [];
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        ⏳ Шалгалтын мэдээлэл ачаалж байна...
      </div>
    );

  if (!exam)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        ❌ Шалгалт олдсонгүй
        <Link className="underline mt-4" to="/team6">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow">
        {/* Header */}
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">{exam.name}</h1>
          <Link to="/team6" className="text-sm underline">
            Буцах
          </Link>
        </div>

        <p className="mt-2 text-gray-600">{questions.length} асуулттай</p>

        {/* Questions Review */}
        <div className="mt-6 space-y-6">
          {questions.map((q, i) => {
            const ans = getAnswer(q.id);

            return (
              <div key={q.id} className="p-5 bg-gray-50 border rounded-lg">
                <h3 className="font-semibold mb-2">
                  {i + 1}. {q.question}
                </h3>

                {q.image && (
                  <img src={q.image} className="w-64 rounded border mb-3" />
                )}

                <p className="font-semibold text-sm text-gray-700">
                  Таны хариулт:
                </p>

                <p className="text-blue-700 font-bold text-lg">
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
            Үр дүн үзэх
          </button>
        </div>
      </div>
    </div>
  );
}
