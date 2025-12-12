import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

export interface Exam {
  id: number;
  course_id: number;
  name: string;
  description: string;
  open_on: string;
  close_on: string;
  end_on: string;
  duration: number;
  total_point: number;
  grade_point: number;
  max_attempt: number;
}

export default function EditExamPage() {
  const { exam_id } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    open_on: "",
    close_on: "",
    duration: "",
    total_point: "",
    grade_point: "",
    max_attempt: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      try {
        // LMS-аас шалгалтын мэдээлэл авах
        const res = await fetch(`${API_URL}/lms/exams/${exam_id}`);
        const data = await res.json();

        if (data) {
          setExam(data);
          // Огноог datetime-local форматруу хөрвүүлэх
          const formatDateForInput = (dateStr: string) => {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            return date.toISOString().slice(0, 16);
          };

          setFormData({
            name: data.name || "",
            description: data.description || "",
            open_on: formatDateForInput(data.open_on),
            close_on: formatDateForInput(data.close_on),
            duration: String(data.duration || 60),
            total_point: String(data.total_point || 100),
            grade_point: String(data.grade_point || 60),
            max_attempt: String(data.max_attempt || 1),
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadExam();
  }, [exam_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name.trim()) {
      setMessage("⚠️ Шалгалтын нэр оруулна уу!");
      return;
    }

    try {
      // LMS API-д PUT хүсэлт илгээх
      const res = await fetch(`${API_URL}/lms/exams/${exam_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Number(exam_id),
          course_id: exam?.course_id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          open_on: new Date(formData.open_on).toISOString(),
          close_on: new Date(formData.close_on).toISOString(),
          end_on: new Date(formData.close_on).toISOString(),
          duration: String(formData.duration),
          total_point: String(formData.total_point),
          grade_point: String(formData.grade_point),
          max_attempt: String(formData.max_attempt),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ Шалгалтын мэдээлэл амжилттай шинэчлэгдлээ!");
      setTimeout(() => navigate(`/team6/exams/${exam_id}`), 1200);
    } catch (error) {
      console.error("❌ Error updating exam:", error);
      setMessage("⚠️ Шалгалтын мэдээлэл шинэчлэхэд алдаа гарлаа!");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Та энэ шалгалтыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй!"
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/lms/exams/${exam_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("❌ DELETE ERROR:", errorData);
        throw new Error(errorData.message || "Delete failed");
      }

      setMessage("✅ Шалгалт амжилттай устгагдлаа!");
      setTimeout(() => navigate("/team6"), 1000);
    } catch (error: any) {
      console.error("❌ Error deleting exam:", error);
      setMessage(`⚠️ Шалгалт устгахад алдаа гарлаа: ${error.message}`);
      setDeleting(false);
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
              name="name"
              value={formData.name}
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
                Нээх огноо *
              </label>
              <input
                type="datetime-local"
                name="open_on"
                value={formData.open_on}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Хаах огноо *
              </label>
              <input
                type="datetime-local"
                name="close_on"
                value={formData.close_on}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Оролдлогын тоо *
              </label>
              <input
                type="number"
                name="max_attempt"
                value={formData.max_attempt}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Нийт оноо *
              </label>
              <input
                type="number"
                name="total_point"
                value={formData.total_point}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Тэнцэх оноо *
              </label>
              <input
                type="number"
                name="grade_point"
                value={formData.grade_point}
                onChange={handleChange}
                required
                min={1}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                placeholder="60"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              💾 Хадгалах
            </button>

            <button
              type="button"
              onClick={() => navigate(`/team6/exams/${exam_id}`)}
              className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Болих
            </button>
          </div>
        </form>

        {/* Delete Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            Аюултай бүс
          </h3>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "🗑️ Устгаж байна..." : "🗑️ Шалгалт устгах"}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Энэ үйлдлийг буцаах боломжгүй. Шалгалтын бүх мэдээлэл устах болно.
          </p>
        </div>

        {message && (
          <p
            className={`mt-6 text-center font-medium ${
              message ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
