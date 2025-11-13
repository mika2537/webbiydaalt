import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { mockVariants, mockQuestionBank } from "../../../../data/mockData";

interface Question {
  id: number;
  question: string;
  type: string;
}

interface Variant {
  id: number;
  examId: number;
  name: string;
  description: string;
  questionIds: number[];
  totalQuestions: number;
  createdAt: string;
}

export default function VariantDetailPage() {
  const { examId, variantId } = useParams<{
    examId: string;
    variantId: string;
  }>();
  const navigate = useNavigate();

  const [variant, setVariant] = useState<Variant | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadVariant = () => {
      const v = mockVariants.find(
        (x) => x.id === Number(variantId) && x.examId === Number(examId)
      );
      if (v) {
        setVariant(v);
        const relatedQuestions = mockQuestionBank.filter((q) =>
          v.questionIds.includes(q.id)
        );
        setQuestions(relatedQuestions);
      }
    };
    loadVariant();
  }, [examId, variantId]);

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачаалж байна...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <Link
          to={`/team6/exams/${examId}/variants`}
          className="text-gray-600 hover:text-gray-900 inline-block mb-4"
        >
          ← Буцах
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {variant.name}
        </h1>
        <p className="text-gray-600 mb-6">{variant.description}</p>

        <div className="mb-6 text-sm text-gray-500">
          <p>Үүсгэсэн: {new Date(variant.createdAt).toLocaleString("mn-MN")}</p>
          <p>Асуултын тоо: {variant.totalQuestions}</p>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-3">Асуултууд:</h2>

        {questions.length > 0 ? (
          <ul className="list-disc ml-6 space-y-2">
            {questions.map((q) => (
              <li key={q.id} className="text-gray-800">
                {q.question}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Асуулт олдсонгүй.</p>
        )}

        <button
          onClick={() => navigate(`/team6/exams/${examId}/variants`)}
          className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Буцах
        </button>
      </div>
    </div>
  );
}
