import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import BackButton from "../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

interface Variant {
  id: string;
  exam_id: string;
  name: string;
  description?: string;
  totalQuestions?: number;
  createdAt?: string;
}

export default function VariantListPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const res = await fetch(`${API_URL}/exams/${examId}/variants`);
        if (!res.ok) throw new Error("Failed to load variants");

        const data = await res.json();

        // Some backends return {items: []}
        const list = Array.isArray(data) ? data : data.items || [];

        setVariants(list);
      } catch (err) {
        console.error("Error loading variants", err);
        setError("Вариантын өгөгдөл ачаалахад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    loadVariants();
  }, [exam_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        ⏳ Түр хүлээнэ үү...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        ❌ {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <BackButton variant="link" className="mb-4" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Шалгалтын вариантын жагсаалт
          </h1>

          <Link
            to={`/team6/exams/${exam_id}/variants/create`}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium"
          >
            + Шинэ вариант
          </Link>
        </div>

        {variants.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            Одоогоор ямар ч вариант үүсээгүй байна.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2 w-10">#</th>
                  <th className="border p-2 text-left">Нэр</th>
                  <th className="border p-2 text-left">Тайлбар</th>
                  <th className="border p-2 text-center">Асуултын тоо</th>
                  <th className="border p-2 text-center">Үүсгэсэн</th>
                </tr>
              </thead>

              <tbody>
                {variants.map((v, i) => (
                  <tr
                    key={v.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/team6/exams/${examId}/variants/${v.id}`)
                    }
                  >
                    <td className="border p-2 text-center">{i + 1}</td>

                    <td className="border p-2 font-medium text-gray-900">
                      {v.name}
                    </td>

                    <td className="border p-2 text-gray-700">
                      {v.description || "-"}
                    </td>

                    <td className="border p-2 text-center">
                      {v.totalQuestions ?? 0}
                    </td>

                    <td className="border p-2 text-center text-gray-600">
                      {v.createdAt
                        ? new Date(v.createdAt).toLocaleDateString("mn-MN")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
