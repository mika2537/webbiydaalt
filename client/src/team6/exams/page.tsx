import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mockCourses, mockExams } from "../data/mockData";
import BackButton from "../components/BackButton";

export default function ExamListPage() {
  const [course, setCourse] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // You can manually set course_id (static mode)
  const course_id = 1; // Example course: Компьютерын архитектур

  useEffect(() => {
    const loadData = () => {
      const courseData = mockCourses.find(
        (c) => String(c.id) === String(course_id)
      );
      const examData = mockExams.filter(
        (e) => String(e.courseId) === String(course_id)
      );
      setCourse(courseData);
      setExams(examData);
      setLoading(false);
    };
    loadData();
  }, [course_id]);

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
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          badges[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {labels[status] || "Тодорхойгүй"}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackButton variant="link" className="mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Шалгалтын жагсаалт
              </h1>
              <p className="text-gray-600 mt-2">
                Хичээл:{" "}
                <span className="font-semibold">
                  {course?.name || "Нэргүй хичээл"}
                </span>{" "}
                ({course?.code || "код байхгүй"})
              </p>
            </div>
            <Link
              to={`/team6/exams/create`}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              + Шинэ шалгалт нэмэх
            </Link>
          </div>
        </div>

        {/* Exam cards */}
        {exams.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Шалгалт байхгүй байна
            </h3>
            <p className="text-gray-500 mb-6">
              Энэ хичээлд одоогоор шалгалт нэмэгдээгүй байна.
            </p>
            <Link
              to={`/team6/exams/create`}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Шалгалт нэмэх
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {exam.title || "Нэргүй шалгалт"}
                        </h3>
                        {getStatusBadge(exam.status)}
                      </div>
                      <p className="text-gray-600">
                        {exam.description || "Тайлбар байхгүй"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <InfoBox
                      label="Эхлэх цаг"
                      value={formatDate(exam.startDate)}
                    />
                    <InfoBox label="Хугацаа" value={`${exam.duration} мин`} />
                    <InfoBox label="Нийт оноо" value={exam.totalMarks} />
                    <InfoBox label="Тэнцэх оноо" value={exam.passingMarks} />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                      Үүсгэсэн: {exam.createdBy || "Тодорхойгүй"} •{" "}
                      {formatDate(exam.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/team6/exams/${exam.id}/variants`}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Вариантууд
                      </Link>
                      <Link
                        to={`/team6/exams/${exam.id}/report`}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Тайлан
                      </Link>
                      <Link
                        to={`/team6/exams/${exam.id}/edit`}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Засах
                      </Link>
                      <Link
                        to={`/team6/exams/${exam.id}`}
                        className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800"
                      >
                        Дэлгэрэнгүй
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const InfoBox = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="text-xs text-gray-500 mb-1">{label}</div>
    <div className="text-sm font-semibold text-gray-900">{value}</div>
  </div>
);
