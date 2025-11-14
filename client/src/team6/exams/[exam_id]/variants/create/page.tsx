import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockVariants } from "../../../../data/mockData";
import BackButton from "../../../../components/BackButton";

interface Variant {
  id: number;
  examId: number;
  name: string;
  description: string;
  questionIds: number[];
  totalQuestions: number;
  createdAt: string;
}

export default function CreateVariantPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const newVariant: Variant = {
        id: Math.floor(Math.random() * 10000),
        examId: Number(examId),
        name: form.name.trim(),
        description: form.description.trim(),
        questionIds: [],
        totalQuestions: 0,
        createdAt: new Date().toISOString(),
      };

      mockVariants.push(newVariant);

      console.log("Амжилттай нэмэгдлээ!", newVariant);
      setMessage("Амжилттай нэмэгдлээ!");
      setForm({ name: "", description: "" });

      setTimeout(() => navigate(`/team6/exams/${examId}`), 1200);
    } catch (error) {
      console.error("❌ Вариант үүсгэхэд алдаа:", error);
      setMessage("⚠️ Вариант үүсгэхэд алдаа гарлаа!");
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
