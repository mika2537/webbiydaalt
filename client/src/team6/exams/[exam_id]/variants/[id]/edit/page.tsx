"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { mockVariants } from "../../../../../data/mockData";

interface Variant {
  id: number;
  examId: number;
  name: string;
  description: string;
  questionIds: number[];
  totalQuestions: number;
  createdAt: string;
}

export default function EditVariantPage() {
  const router = useRouter();
  const { exam_id, variant_id } = useParams<{
    exam_id: string;
    variant_id: string;
  }>();

  const [variant, setVariant] = useState<Variant | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Load existing variant data
  useEffect(() => {
    const v = mockVariants.find(
      (x) => x.id === Number(variant_id) && x.examId === Number(exam_id)
    );
    if (v) {
      setVariant(v);
      setForm({
        name: v.name,
        description: v.description,
      });
    }
    setLoading(false);
  }, [exam_id, variant_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Save edited data (mock update)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessage("⚠️ Вариантын нэр оруулна уу!");
      return;
    }

    try {
      const index = mockVariants.findIndex(
        (x) => x.id === Number(variant_id) && x.examId === Number(exam_id)
      );
      if (index !== -1) {
        mockVariants[index] = {
          ...mockVariants[index],
          name: form.name.trim(),
          description: form.description.trim(),
        };
        console.log("✅ Variant updated:", mockVariants[index]);
      }

      setMessage("Амжилттай шинэчлэгдлээ!");
      setTimeout(() => {
        router.push(`/team6/exams/${exam_id}/variants/${variant_id}`);
      }, 1200);
    } catch (error) {
      console.error("❌ Вариант засахад алдаа:", error);
      setMessage("⚠️ Алдаа гарлаа!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Ачаалж байна...
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ❌ Вариант олдсонгүй.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <Link
          href={`/team6/exams/${exam_id}/variants/${variant_id}`}
          className="text-gray-600 hover:text-gray-900 inline-block mb-4"
        >
          ← Буцах
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Вариант засах</h1>

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
              placeholder="Тайлбар оруулах..."
              rows={3}
              className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-black focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition"
          >
            Хадгалах
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

        <button
          onClick={() =>
            router.push(`/team6/exams/${exam_id}/variants/${variant_id}`)
          }
          className="mt-6 w-full py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Болих
        </button>
      </div>
    </div>
  );
}
