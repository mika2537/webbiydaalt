import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/api";

export default function ExamDetailPage() {
  const { exam_id } = useParams();
  const [exam, setExam] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1) Load exam
        const examRes = await fetch(`${API_URL}/exams/${exam_id}`);
        const examData = await examRes.json();

        // 2) Load variants
        const variantsRes = await fetch(`${API_URL}/exams/${exam_id}/variants`);
        const variantsData = await variantsRes.json();

        // 3) Load stats
        const statsRes = await fetch(`${API_URL}/exams/${exam_id}/stats`);
        const statsData = await statsRes.json();

        setExam(examData);
        setVariants(Array.isArray(variantsData) ? variantsData : []);
        setStats(statsData || null);
      } catch (error) {
        console.error("API Error:", error);
      }

      setLoading(false);
    };

    loadData();
  }, [exam_id]);

  const getStatusBadge = (status: string) => {
    const badges: any = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
    };
    const labels: any = {
      upcoming: "Удахгүй",
      active: "Явагдаж байна",
      completed: "Дууссан",
    };
    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          badges[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {labels[status] || "Тодорхойгүй"}
      </span>
    );
  };

  const formatDate = (value?: string) => {
    if (!value) return "—";
    const date = new Date(value);
    return date.toLocaleString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Шалгалт олдсонгүй
          </h2>
          <Link to="/team6/courses" className="text-black hover:underline">
            Буцах
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={`/team6/courses/${exam.courseId}/exams`}
            className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
          >
            ← Буцах
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {exam.name}
              </h1>
              <p className="text-gray-600">{exam.description}</p>
            </div>
            <div className="flex gap-2 items-center">
              {getStatusBadge(exam.status)}
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Шалгалтын мэдээлэл
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoRow label="Эхлэх огноо:" value={formatDate(exam.open_on)} />
              <InfoRow
                label="Дуусах огноо:"
                value={formatDate(exam.close_on)}
              />
              <InfoRow
                label="Үргэлжлэх хугацаа:"
                value={`${exam.duration} минут`}
              />
            </div>

            <div className="space-y-4">
              <InfoRow label="Нийт оноо:" value={exam.total_point || "—"} />
              <InfoRow label="Тэнцэх оноо:" value={exam.grade_point || "—"} />
              <InfoRow label="Үүсгэсэн:" value={formatDate(exam.createdAt)} />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Вариантууд ({variants.length})
            </h2>

            <Link
              to={`/team6/exams/${exam_id}/variants/create`}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              + Вариант нэмэх
            </Link>
          </div>

          {variants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Вариант нэмэгдээгүй байна
            </div>
          ) : (
            <div className="space-y-3">
              {variants.map((variant) => (
                <Link
                  key={variant.id}
                  to={`/team6/exams/${exam_id}/variants/${variant.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {variant.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {variant.description}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500">
                      {variant.totalQuestions ?? 0} асуулт
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-100 pb-3">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);
