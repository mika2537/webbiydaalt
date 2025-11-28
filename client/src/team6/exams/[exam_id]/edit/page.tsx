import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

export interface Exam {
  id: number;
  courseId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  status: string;
  createdBy: string;
  createdAt: string;
  selectedTopics: { topicId: number; questionCount: number }[];
  totalQuestions: number;
  updatedAt?: string; // ✅ Add this line
}

export default function EditExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    examDate: "",
    duration: "",
    totalMarks: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const res = await fetch(`${API_URL}/exams/${examId}`);
        const data = await res.json();

        if (data) {
          setExam(data);
          setFormData({
            title: data.title,
            description: data.description,
            examDate: data.startDate,
            duration: String(data.duration),
            totalMarks: String(data.totalMarks),
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadExam();
  }, [examId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("⚠️ Шалгалтын нэр оруулна уу!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/exams/${examId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          startDate: formData.examDate,
          duration: Number(formData.duration),
          totalMarks: Number(formData.totalMarks),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("Шалгалтын мэдээлэл амжилттай шинэчлэгдлээ!");
      setTimeout(() => navigate(`/team6/exams/${examId}`), 1200);
    } catch (error) {
      console.error("❌ Error updating exam:", error);
      setMessage("⚠️ Шалгалтын мэдээлэл шинэчлэхэд алдаа гарлаа!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачаалж байна...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Шалгалт олдсонгүй.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <BackButton variant="link" className="mb-4" />

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Шалгалт засах</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Шалгалтын нэр *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              placeholder="Жишээ: Дунд шалгалт"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Тайлбар
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              placeholder="Шалгалтын талаархи мэдээлэл..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Огноо *
              </label>
              <input
                type="datetime-local"
                name="examDate"
                value={formData.examDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Үргэлжлэх хугацаа (минут) *
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Нийт оноо *
            </label>
            <input
              type="number"
              name="totalMarks"
              value={formData.totalMarks}
              onChange={handleChange}
              required
              min={1}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              placeholder="100"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Хадгалах
            </button>

            <button
              type="button"
              onClick={() => navigate(`/team6/exams/${examId}`)}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Болих
            </button>
          </div>
        </form>

        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message.includes("амжилттай") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
