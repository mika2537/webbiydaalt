import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";

const API_URL = "http://localhost:3001/api";

// ---------- TYPES ----------
interface Course {
  id: number;
  name: string;
}

interface LMSQuestionLevel {
  id: number;
  name: string;
  priority: number;
}

interface LMSQuestionType {
  id: number;
  name: string;
  priority: number;
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const { courseId } = useParams(); // dynamic
  const cId = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<LMSQuestionLevel[]>([]);
  const [types, setTypes] = useState<LMSQuestionType[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLevels, setSelectedLevels] = useState<Record<number, number>>(
    {}
  );
  const [selectedTypes, setSelectedTypes] = useState<Record<number, number>>(
    {}
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: 60,
    totalMarks: 100,
    passingMarks: 30,
  });

  // ---------- LOAD DATA ----------
  useEffect(() => {
    const load = async () => {
      try {
        const cRes = await fetch(`${API_URL}/courses/${cId}`);
        setCourse(await cRes.json());

        const lvlRes = await fetch("https://todu.mn/bs/lms/v1/question-levels");
        const lvlJson = await lvlRes.json();
        setLevels(lvlJson.items || []);

        const typeRes = await fetch("https://todu.mn/bs/lms/v1/question-types");
        const typeJson = await typeRes.json();
        setTypes(typeJson.items || []);
      } catch (e) {
        console.error("LOAD ERROR:", e);
      }
      setLoading(false);
    };
    load();
  }, [cId]);

  // ---------- HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const totalSelected =
    Object.values(selectedLevels).reduce((a, b) => a + b, 0) +
    Object.values(selectedTypes).reduce((a, b) => a + b, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Нэр оруулна уу");
      return;
    }

    if (totalSelected === 0) {
      alert("Ядаж 1 асуулт сонгоно уу.");
      return;
    }

    const body = {
      name: formData.title,
      description: formData.description,

      open_on: `${formData.startDate}T${formData.startTime}:00`,
      close_on: `${formData.endDate}T${formData.endTime}:00`,
      end_on: `${formData.endDate}T${formData.endTime}:00`,

      duration: String(formData.duration),
      total_point: String(formData.totalMarks),
      grade_point: String(formData.passingMarks),
      max_attempt: "1",
      point_expression: "",

      courseId: cId,

      levels: selectedLevels,
      types: selectedTypes,

      totalQuestions: totalSelected,
      status: "upcoming",
    };

    try {
      const res = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("FAILED");

      alert("Шалгалт амжилттай үүслээ!");
      navigate(`/team6/courses/${cId}/exams`);
    } catch (err) {
      console.error("CREATE ERROR:", err);
      alert("Алдаа гарлаа!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
      </div>
    );

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <BackButton variant="link" className="mb-4" />

        <h1 className="text-3xl font-bold">Шинэ шалгалт үүсгэх</h1>
        <p className="text-gray-600">{course?.name}</p>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {/* BASIC INFO */}
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="font-bold text-xl">Үндсэн мэдээлэл</h2>

            <Input label="Шалгалтын нэр" name="title" onChange={handleChange} />

            <TextArea
              label="Тайлбар"
              name="description"
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Эхлэх огноо"
                type="date"
                name="startDate"
                onChange={handleChange}
              />
              <Input
                label="Эхлэх цаг"
                type="time"
                name="startTime"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Дуусах огноо"
                type="date"
                name="endDate"
                onChange={handleChange}
              />
              <Input
                label="Дуусах цаг"
                type="time"
                name="endTime"
                onChange={handleChange}
              />
            </div>

            <Input
              label="Хугацаа (минут)"
              type="number"
              name="duration"
              onChange={handleChange}
            />

            <Input
              label="Нийт оноо"
              type="number"
              name="totalMarks"
              onChange={handleChange}
            />
            <Input
              label="Тэнцэх оноо"
              type="number"
              name="passingMarks"
              onChange={handleChange}
            />
          </div>

          {/* BLOOM LEVEL */}
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="font-bold text-xl">Асуултын түвшин (Bloom Level)</h2>

            {levels.map((lvl) => (
              <div
                key={lvl.id}
                className="flex justify-between border p-3 rounded"
              >
                <span>{lvl.name}</span>
                <input
                  type="number"
                  min={0}
                  value={selectedLevels[lvl.id] || 0}
                  onChange={(e) =>
                    setSelectedLevels((p) => ({
                      ...p,
                      [lvl.id]: Number(e.target.value),
                    }))
                  }
                  className="border p-2 w-24"
                />
              </div>
            ))}
          </div>

          {/* QUESTION TYPES */}
          <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="font-bold text-xl">Асуултын төрөл</h2>

            {types.map((t) => (
              <div
                key={t.id}
                className="flex justify-between border p-3 rounded"
              >
                <span>{t.name}</span>
                <input
                  type="number"
                  min={0}
                  value={selectedTypes[t.id] || 0}
                  onChange={(e) =>
                    setSelectedTypes((prev) => ({
                      ...prev,
                      [t.id]: Number(e.target.value),
                    }))
                  }
                  className="border p-2 w-24"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-black text-white p-4 rounded w-full mt-4"
          >
            Шалгалт үүсгэх
          </button>
        </form>
      </div>
    </div>
  );
}

// COMPONENTS
function Input(props) {
  return (
    <div>
      <label className="block mb-1 text-sm">{props.label}</label>
      <input {...props} className="w-full border p-3 rounded" />
    </div>
  );
}

function TextArea(props) {
  return (
    <div>
      <label className="block mb-1 text-sm">{props.label}</label>
      <textarea {...props} rows={3} className="w-full border p-3 rounded" />
    </div>
  );
}
