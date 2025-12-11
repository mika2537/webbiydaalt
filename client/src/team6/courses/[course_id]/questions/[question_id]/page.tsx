import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

interface Question {
  id: number;
  course_id: number;
  topicId: number;
  question: string;
  type: string;
  marks: number;
  level: string;
  options?: string[];
  correctAnswers?: string[];
  image?: string;
}

interface Topic {
  id: number;
  name: string;
}

export default function QuestionDetailPage() {
  const { course_id, question_id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestion = async () => {
      try {
        const res = await fetch(`${API_URL}/questions/${question_id}`);
        const data = await res.json();
        setQuestion(data);

        if (data.topicId) {
          const topicRes = await fetch(`${API_URL}/topics/${data.topicId}`);
          const topicData = await topicRes.json();
          setTopic(topicData);
        }
      } catch (error) {
        console.error("Failed to load question:", error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestion();
  }, [question_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ачааллаж байна...</p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xl text-gray-600 mb-4">Асуулт олдсонгүй</p>
          <Link
            to={`/team6/courses/${course_id}/questions`}
            className="text-blue-600 hover:underline"
          >
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  const levelLabels: Record<string, string> = {
    easy: "Хялбар",
    medium: "Дунд",
    hard: "Хэцүү",
  };

  const typeLabels: Record<string, string> = {
    single: "Нэг сонголттой",
    multiple: "Олон сонголттой",
    text: "Богино хариулт",
    essay: "Эссэ",
  };

  const levelColors: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton />

        <div className="bg-white rounded-lg shadow-sm border p-8 mt-4">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Асуултын дэлгэрэнгүй
              </h1>
              {topic && (
                <p className="text-gray-600">
                  Сэдэв: <span className="font-medium">{topic.name}</span>
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelColors[question.level] || "bg-gray-100 text-gray-800"
                }`}
              >
                {levelLabels[question.level] || question.level}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {question.marks} оноо
              </span>
            </div>
          </div>

          {/* Question Type */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Төрөл:</p>
            <p className="font-medium">
              {typeLabels[question.type] || question.type}
            </p>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Асуулт:</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-lg">{question.question}</p>
            </div>
          </div>

          {/* Question Image */}
          {question.image && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Зураг:</p>
              <img
                src={question.image}
                alt="Question"
                className="max-w-md rounded-lg border"
              />
            </div>
          )}

          {/* Options (for single/multiple choice) */}
          {question.options && question.options.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Сонголтууд:</p>
              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isCorrect = question.correctAnswers?.includes(option);
                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrect
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isCorrect && (
                          <span className="text-green-600 font-medium text-sm">
                            ✓ Зөв хариулт
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Correct Answers (for text/essay) */}
          {question.correctAnswers &&
            question.correctAnswers.length > 0 &&
            !question.options && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Зөв хариулт:</p>
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  {question.correctAnswers.map((answer, index) => (
                    <p key={index} className="text-green-800">
                      {answer}
                    </p>
                  ))}
                </div>
              </div>
            )}

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Link
              to={`/team6/courses/${course_id}/questions/${question_id}/edit`}
              className="flex-1 px-6 py-3 text-center bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Засах
            </Link>
            <button
              onClick={() => {
                if (confirm("Энэ асуултыг устгахдаа итгэлтэй байна уу?")) {
                  // TODO: Implement delete
                  alert("Устгах функц тохируулаагүй байна");
                }
              }}
              className="px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              Устгах
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
