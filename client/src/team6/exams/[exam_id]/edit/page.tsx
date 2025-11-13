import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { mockExams } from "../../../data/mockData";

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

  // ✅ Load exam from mock data
  useEffect(() => {
    const foundExam = mockExams.find((e) => e.id === Number(examId));
    if (foundExam) {
      setExam(foundExam);
      setFormData({
        title: foundExam.title,
        description: foundExam.description,
        examDate: foundExam.startDate,
        duration: String(foundExam.duration),
        totalMarks: String(foundExam.totalMarks),
      });
    }
    setLoading(false);
  }, [examId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.title.trim()) {
      setMessage("⚠️ Шалгалтын нэр оруулна уу!");
      return;
    }

    try {
      const index = mockExams.findIndex((e) => e.id === Number(examId));
      if (index !== -1) {
        mockExams[index] = {
          ...mockExams[index],
          title: formData.title.trim(),
          description: formData.description.trim(),
          startDate: formData.examDate,
          duration: Number(formData.duration),
          totalMarks: Number(formData.totalMarks),
          // updatedAt: new Date().toISOString(),
        };
      }

      console.log("✅ Exam updated:", mockExams[index]);
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
        <Link
          to={`/team6/exams/${examId}`}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-block"
        >
          ← Буцах
        </Link>

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
