import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ResultPage() {
  const { exam_id, student_id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/students/${exam_id}/${student_id}/result`
        );
        const data = await res.json();
        setResult(data);
      } catch (err) {
        console.error("Result load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [exam_id, student_id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ⏳ Ачааллаж байна...
      </div>
    );
  if (!result)
    return (
      <div className="min-h-screen flex items-center justify-center">
        ❌ Алдаа гарлаа{" "}
        <Link to="/team6" className="underline">
          Буцах
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Үр дүн — {result.exam_id}</h1>
        <p className="text-lg font-bold">Оноо: {result.score}</p>
        <p className="mt-2">
          Зөв: {result.correct} • Буруу: {result.wrong}
        </p>
        <p className="mt-4 font-bold">
          {result.grade === "PASS" ? "ТЭНЦСЭН ✅" : "ТЭНЦЭЭГҮЙ ❌"}
        </p>
        <div className="mt-6">
          <Link to="/team6" className="underline">
            Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
