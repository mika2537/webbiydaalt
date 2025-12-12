import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

export default function StudentExamStartPage() {
  const { exam_id, id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const examRes = await fetch(`${API_URL}/lms/exams/${exam_id}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!examRes.ok) throw new Error("Шалгалт олдсонгүй");

        const examData = await examRes.json();
        setExam(examData);

        const courseRes = await fetch(
          `${API_URL}/lms/courses/${examData.course_id}/users`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          const foundStudent = courseData.items?.find(
            (item: any) => item.user_id === parseInt(id || "0")
          );
          setStudent(foundStudent);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("API error:", err);
        setError(err.message || "Алдаа гарлаа");
        setLoading(false);
      }
    }

    load();
  }, [exam_id, id]);

  const formatDate = (dateString?: string) => {
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

  const getExamStatus = () => {
    if (!exam) return "unknown";
    const now = new Date();
    const open = new Date(exam.open_on);
    const close = new Date(exam.close_on);

    if (now < open) return "upcoming";
    if (now > close) return "closed";
    return "active";
  };

  const handleStartExam = async () => {
    try {
      // Шалгалт эхлүүлэх - exam sheet үүсгэх
      const res = await fetch(`${API_URL}/lms/users/me/exams/${exam_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Шалгалт эхлүүлэхэд алдаа:", errorData);
        // Хэрэв аль хэдийн эхэлсэн бол үргэлжлүүлэх
      }

      navigate(`/team6/exams/${exam_id}/students/${id}/take`);
    } catch (err) {
      console.error("Start exam error:", err);
      // Алдаа гарсан ч үргэлжлүүлэх (магадгүй өмнө эхэлсэн байж болно)
      navigate(`/team6/exams/${exam_id}/students/${id}/take`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {error || "Шалгалт олдсонгүй"}
        </h2>
        <Link to="/team6" className="mt-4 underline">
          Буцах
        </Link>
      </div>
    );
  }

  const status = getExamStatus();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <BackButton variant="link" className="mb-4" />

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {exam.name}
            </h1>
            {exam.description && (
              <p className="text-gray-600">{exam.description}</p>
            )}
          </div>

          {student && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                Оюутны мэдээлэл
              </h3>
              <p className="text-gray-700">
                <span className="font-medium">Нэр:</span>{" "}
                {student.user?.last_name} {student.user?.first_name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Код:</span>{" "}
                {student.user?.username}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <InfoBox label="Нээх цаг" value={formatDate(exam.open_on)} />
            <InfoBox label="Хаах цаг" value={formatDate(exam.close_on)} />
            <InfoBox label="Хугацаа" value={`${exam.duration} минут`} />
            <InfoBox label="Нийт оноо" value={exam.total_point} />
            <InfoBox label="Тэнцэх оноо" value={exam.grade_point} />
            <InfoBox label="Оролдлогын тоо" value={exam.max_attempt} />
          </div>

          <div className="border-t pt-6">
            {status === "active" ? (
              <div className="text-center">
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">
                    Шалгалт эхлэхэд бэлэн
                  </h3>
                  <p className="text-green-700">
                    Та {exam.duration} минутын хугацаатай шалгалт өгөх болно
                  </p>
                </div>

                <button
                  onClick={handleStartExam}
                  className="px-8 py-4 bg-black text-white text-lg font-semibold rounded-lg hover:bg-gray-800"
                >
                  Шалгалт эхлүүлэх →
                </button>
              </div>
            ) : status === "closed" ? (
              <div className="text-center p-6 bg-gray-100 rounded-lg">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-bold">Шалгалт дууссан</h3>
              </div>
            ) : (
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-3">⏰</div>
                <h3 className="text-xl font-bold">Шалгалт удахгүй эхэлнэ</h3>
              </div>
            )}
          </div>
        </div>
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
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="text-lg font-semibold text-gray-900">{value}</div>
  </div>
);
