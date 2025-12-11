import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../../components/BackButton";
const API_URL = "http://localhost:3001/api";

export default function CreateVariantPage() {
  const navigate = useNavigate();
  const { exam_id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // POST /api/exams/:exam_id/variants
      const res = await fetch(`${API_URL}/exams/${exam_id}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create variant");
      }

      const variantId = data.id;

      // Check if there are pending questions from exam creation
      const pendingQuestions = sessionStorage.getItem("pendingExamQuestions");

      if (pendingQuestions) {
        const questionIds = JSON.parse(pendingQuestions);

        // Add each question to the variant
        for (const questionId of questionIds) {
          try {
            await fetch(`${API_URL}/variants/${variantId}/questions`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                question_id: questionId,
                point: 10,
                priority: 1,
              }),
            });
          } catch (err) {
            console.error(`Failed to add question ${questionId}:`, err);
          }
        }

        // Clear session storage
        sessionStorage.removeItem("pendingExamQuestions");
        sessionStorage.removeItem("pendingExamId");

        setMessage("Вариант болон асуултууд амжилттай нэмэгдлээ!");
      } else {
        setMessage("Амжилттай нэмэгдлээ!");
      }

      setForm({ name: "", description: "" });

      setTimeout(() => navigate(`/team6/exams/${exam_id}`), 1500);
    } catch (error: any) {
      console.error("❌ Вариант үүсгэхэд алдаа:", error);
      setMessage(`⚠️ ${error.message || "Вариант үүсгэхэд алдаа гарлаа!"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Шинэ вариант нэмэх
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Вариантын нэр *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Жишээ: Вариант A"
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Тайлбар
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Вариантын дэлгэрэнгүй тайлбар..."
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {loading ? "⏳ Үүсгэж байна..." : "Нэмэх"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("Амжилттай") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <BackButton className="mt-6 w-full" to={`/team6/exams/`} />
      </div>
    </div>
  );
}
