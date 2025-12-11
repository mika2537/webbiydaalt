import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface StudentAnswer {
  questionId: number;
  response: string[];
}

interface Question {
  id: number;
  question: string;
  type: string;
  options?: string[];
  correctAnswers: string[];
  marks: number;
  image?: string;
}

export default function CheckExamPage() {
  const { exam_id, student_id } = useParams();

  const API_URL = "http://localhost:3001/api";

  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------
  // Load exam + questions + student answers
  // ---------------------------------------------------
  useEffect(() => {
    async function load() {
      try {
        // 1. Exam info from LMS
        const examRes = await fetch(`${API_URL}/lms/exams/${exam_id}`);
        const examData = await examRes.json();
        setExam(examData);

        // 2. Question references from backend
        const qRefsRes = await fetch(`${API_URL}/exams/${exam_id}/questions`);
        const qRefs = await qRefsRes.json();

        // 3. Load actual question details from LMS
        const questionPromises = qRefs.map(async (ref: any) => {
          const qRes = await fetch(
            `${API_URL}/lms/questions/${ref.question_id}`
          );
          const qData = await qRes.json();

          // Fix options field
          if (qData.option && Array.isArray(qData.option.options)) {
            qData.options = qData.option.options;
          }

          return {
            id: ref.question_id,
            question: qData.question,
            type: qData.type_id === 10 ? "true_false" : "multiple_choice",
            options: qData.options || [],
            correctAnswers: qData.correct_answers || [],
            marks: ref.point || 10,
          };
        });

        const loadedQuestions = await Promise.all(questionPromises);
        setQuestions(loadedQuestions);

        // 4. Student answers
        const studentRes = await fetch(
          `${API_URL}/students/${exam_id}/${student_id}`
        );
        const studentData = await studentRes.json();

        setStudentAnswers(
          (studentData.answers || []).map((a: any) => ({
            questionId: a.questionId,
            response: Array.isArray(a.response)
              ? a.response
              : [a.response ?? ""],
          }))
        );
      } catch (err) {
        console.error("Error loading exam:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [exam_id, student_id]);

  // ---------------------------------------------------
  // Helpers
  // ---------------------------------------------------
  const getAnswer = (qid: number) =>
    studentAnswers.find((a) => a.questionId === qid)?.response;

  const isCorrectAnswer = (q: Question, answer?: string[]) => {
    if (!answer || answer.length === 0) return false;

    if (q.type === "multiple_choice")
      return q.correctAnswers.includes(answer[0]);

    if (q.type === "multiple_correct") {
      if (answer.length !== q.correctAnswers.length) return false;
      return q.correctAnswers.every((x) => answer.includes(x));
    }

    if (q.type === "fill_blank" || q.type === "text_answer") {
      const a = answer[0].trim().toLowerCase();
      return q.correctAnswers.some((c) => c.trim().toLowerCase() === a);
    }

    return false;
  };

  // ---------------------------------------------------
  // UI — Loading / No Data
  // ---------------------------------------------------
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачаалж байна…
      </div>
    );

  if (!exam || questions.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ❌ Мэдээлэл олдсонгүй.
        <Link to="/team6/student" className="underline ml-3">
          Буцах
        </Link>
      </div>
    );

  // ---------------------------------------------------
  // UI — RESULT PAGE
  // ---------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">
        <Link
          to={`/team6/exams/${exam_id}/students/${student_id}/result`}
          className="text-gray-600 hover:text-black"
        >
          ← Буцах
        </Link>

        <h1 className="text-3xl font-bold mt-4 mb-1">Таны хариултууд</h1>
        <p className="mb-6 text-gray-600">{exam.name}</p>

        <div className="space-y-6">
          {questions.map((q, index) => {
            const answer = getAnswer(q.id);
            const correct = isCorrectAnswer(q, answer);

            return (
              <div
                key={q.id}
                className={`p-5 rounded-xl border-2 ${
                  correct
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">
                  {index + 1}. {q.question}
                </h3>

                {q.image && (
                  <img src={q.image} className="w-72 rounded border mb-3" />
                )}

                <p className="font-medium text-gray-700 text-sm">
                  Таны хариулт:
                </p>
                <p
                  className={`font-semibold ${
                    correct ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {answer?.length ? answer.join(", ") : "—"}
                </p>

                {!correct && (
                  <div className="p-3 mt-3 rounded border bg-white">
                    <p className="font-medium text-green-700">✓ Зөв хариулт:</p>
                    <p className="font-semibold text-green-800">
                      {q.correctAnswers.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to={`/team6/exams/${exam_id}/students/${student_id}/result`}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Үр дүн рүү буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
