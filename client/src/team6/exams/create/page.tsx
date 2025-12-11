import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

interface Question {
  id: number;
  name: string;
  question: string;
  point: number;
  type_id: number;
  type_name?: string;
  level_id: number;
  level_name?: string;
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const { course_id } = useParams();
  const cId = Number(course_id);

  const [course, setCourse] = useState<Course | null>(null);
  const [levels, setLevels] = useState<LMSQuestionLevel[]>([]);
  const [types, setTypes] = useState<LMSQuestionType[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected question IDs
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<number>>(
    new Set()
  );

  // Filter states
  const [filterLevel, setFilterLevel] = useState<number | "">("");
  const [filterType, setFilterType] = useState<number | "">("");

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
    max_attempt: 1,
  });

  // ---------- LOAD DATA ----------
  useEffect(() => {
    const load = async () => {
      try {
        // Load course info
        const cRes = await fetch(`${API_URL}/courses/${cId}`);
        setCourse(await cRes.json());

        // Load question levels
        const lvlRes = await fetch(`${API_URL}/lms/question-levels`);
        const lvlJson = await lvlRes.json();
        setLevels(lvlJson.items || []);

        // Load question types
        const typeRes = await fetch(`${API_URL}/lms/question-types`);
        const typeJson = await typeRes.json();
        setTypes(typeJson.items || []);

        // Load course questions
        const qRes = await fetch(`${API_URL}/courses/${cId}/questions`);
        const qJson = await qRes.json();
        console.log("📚 Course questions:", qJson);
        setQuestions(qJson.items || []);
      } catch (e) {
        console.error("LOAD ERROR:", e);
      }
      setLoading(false);
    };
    load();
  }, [cId]);

  // ---------- HANDLERS ----------
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleQuestion = (qId: number) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(qId)) {
        newSet.delete(qId);
      } else {
        newSet.add(qId);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    const filtered = filteredQuestions.map((q) => q.id);
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      filtered.forEach((id) => newSet.add(id));
      return newSet;
    });
  };

  const deselectAll = () => {
    setSelectedQuestionIds(new Set());
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (filterLevel !== "" && q.level_id !== filterLevel) return false;
    if (filterType !== "" && q.type_id !== filterType) return false;
    return true;
  });

  // Categorize questions by difficulty
  const easyQuestions = questions.filter((q) => q.point >= 10 && q.point <= 20);
  const mediumQuestions = questions.filter(
    (q) => q.point >= 30 && q.point <= 40
  );
  const hardQuestions = questions.filter((q) => q.point >= 50 && q.point <= 60);

  // Get selected count per category
  const selectedEasy = easyQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;
  const selectedMedium = mediumQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;
  const selectedHard = hardQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;

  // Calculate total points of selected questions
  const selectedQuestions = questions.filter((q) =>
    selectedQuestionIds.has(q.id)
  );
  const totalSelectedPoints = selectedQuestions.reduce(
    (sum, q) => sum + (q.point || 0),
    0
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Нэр оруулна уу");
      return;
    }

    if (selectedQuestionIds.size === 0) {
      alert("Ядаж 1 асуулт сонгоно уу.");
      return;
    }

    // Build the exam body for Swagger API
    const body = {
      name: formData.title,
      description: formData.description,
      open_on: `${formData.startDate}T${formData.startTime}:00Z`,
      close_on: `${formData.endDate}T${formData.endTime}:00Z`,
      end_on: `${formData.endDate}T${formData.endTime}:00Z`,
      duration: String(formData.duration),
      total_point: String(formData.totalMarks),
      grade_point: String(formData.passingMarks),
      max_attempt: String(formData.max_attempt),
      point_expression: "",
      // Include question IDs
      questions: Array.from(selectedQuestionIds).map((id) => ({ id })),
    };

    console.log("📤 Creating exam:", body);

    try {
      // POST /api/courses/{course_id}/exams
      const res = await fetch(`${API_URL}/courses/${cId}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("📥 Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to create exam");
      }

      alert("Шалгалт амжилттай үүслээ!");
      navigate(`/team6/courses/${cId}/exams`);
    } catch (err: any) {
      console.error("CREATE ERROR:", err);
      alert(`Алдаа: ${err.message}`);
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
      <div className="max-w-6xl mx-auto">
        <BackButton variant="link" className="mb-4" />

        <h1 className="text-3xl font-bold">Шинэ шалгалт үүсгэх</h1>
        <p className="text-gray-600 mb-6">{course?.name}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="bg-white p-6 rounded-lg shadow space-y-4">
            <h2 className="font-bold text-xl border-b pb-2">Үндсэн мэдээлэл</h2>

            <Input
              label="Шалгалтын нэр *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <TextArea
              label="Тайлбар"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Эхлэх огноо *"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Эхлэх цаг *"
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
              <Input
                label="Дуусах огноо *"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
              <Input
                label="Дуусах цаг *"
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Хугацаа (мин)"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min={1}
              />
              <Input
                label="Нийт оноо"
                type="number"
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                min={1}
              />
              <Input
                label="Тэнцэх оноо"
                type="number"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                min={0}
              />
              <Input
                label="Оролдлогын тоо"
                type="number"
                name="max_attempt"
                value={formData.max_attempt}
                onChange={handleChange}
                min={1}
              />
            </div>
          </div>

          {/* QUESTION SELECTION BY DIFFICULTY */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="font-bold text-xl">
                Асуултыг хүндийн түвшнээр сонгох
              </h2>
              <div className="text-sm text-gray-600">
                Нийт:{" "}
                <span className="font-bold text-blue-600">
                  {selectedQuestionIds.size}
                </span>{" "}
                асуулт | Оноо:{" "}
                <span className="font-bold text-green-600">
                  {totalSelectedPoints}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {/* EASY SECTION - 10-20 оноо */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-green-800 flex items-center gap-2">
                    😊 Амархан (10-20 оноо)
                    <span className="text-sm font-normal text-green-600">
                      {selectedEasy}/{easyQuestions.length} сонгосон
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = easyQuestions.every((q) =>
                        selectedQuestionIds.has(q.id)
                      );
                      setSelectedQuestionIds((prev) => {
                        const newSet = new Set(prev);
                        easyQuestions.forEach((q) => {
                          if (allSelected) newSet.delete(q.id);
                          else newSet.add(q.id);
                        });
                        return newSet;
                      });
                    }}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    {selectedEasy === easyQuestions.length
                      ? "Болих"
                      : "Бүгдийг сонгох"}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {easyQuestions.length === 0 ? (
                    <p className="text-green-700 text-sm">
                      Амархан асуулт байхгүй
                    </p>
                  ) : (
                    easyQuestions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestion(q.id)}
                        className={`p-3 rounded cursor-pointer border ${
                          selectedQuestionIds.has(q.id)
                            ? "bg-green-200 border-green-400"
                            : "bg-white border-green-300 hover:bg-green-100"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.has(q.id)}
                            onChange={() => toggleQuestion(q.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{q.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Оноо: {q.point} | Төрөл:{" "}
                              {types.find((t) => t.id === q.type_id)?.name ||
                                "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* MEDIUM SECTION - 30-40 оноо */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-yellow-800 flex items-center gap-2">
                    🤔 Дунд (30-40 оноо)
                    <span className="text-sm font-normal text-yellow-600">
                      {selectedMedium}/{mediumQuestions.length} сонгосон
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = mediumQuestions.every((q) =>
                        selectedQuestionIds.has(q.id)
                      );
                      setSelectedQuestionIds((prev) => {
                        const newSet = new Set(prev);
                        mediumQuestions.forEach((q) => {
                          if (allSelected) newSet.delete(q.id);
                          else newSet.add(q.id);
                        });
                        return newSet;
                      });
                    }}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    {selectedMedium === mediumQuestions.length
                      ? "Болих"
                      : "Бүгдийг сонгох"}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {mediumQuestions.length === 0 ? (
                    <p className="text-yellow-700 text-sm">
                      Дунд түвшний асуулт байхгүй
                    </p>
                  ) : (
                    mediumQuestions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestion(q.id)}
                        className={`p-3 rounded cursor-pointer border ${
                          selectedQuestionIds.has(q.id)
                            ? "bg-yellow-200 border-yellow-400"
                            : "bg-white border-yellow-300 hover:bg-yellow-100"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.has(q.id)}
                            onChange={() => toggleQuestion(q.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{q.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Оноо: {q.point} | Төрөл:{" "}
                              {types.find((t) => t.id === q.type_id)?.name ||
                                "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* HARD SECTION - 50-60 оноо */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-lg text-red-800 flex items-center gap-2">
                    🔥 Хүнд (50-60 оноо)
                    <span className="text-sm font-normal text-red-600">
                      {selectedHard}/{hardQuestions.length} сонгосон
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const allSelected = hardQuestions.every((q) =>
                        selectedQuestionIds.has(q.id)
                      );
                      setSelectedQuestionIds((prev) => {
                        const newSet = new Set(prev);
                        hardQuestions.forEach((q) => {
                          if (allSelected) newSet.delete(q.id);
                          else newSet.add(q.id);
                        });
                        return newSet;
                      });
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    {selectedHard === hardQuestions.length
                      ? "Болих"
                      : "Бүгдийг сонгох"}
                  </button>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {hardQuestions.length === 0 ? (
                    <p className="text-red-700 text-sm">Хүнд асуулт байхгүй</p>
                  ) : (
                    hardQuestions.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => toggleQuestion(q.id)}
                        className={`p-3 rounded cursor-pointer border ${
                          selectedQuestionIds.has(q.id)
                            ? "bg-red-200 border-red-400"
                            : "bg-white border-red-300 hover:bg-red-100"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={selectedQuestionIds.has(q.id)}
                            onChange={() => toggleQuestion(q.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{q.name}</div>
                            <div className="text-xs text-gray-600 mt-1">
                              Оноо: {q.point} | Төрөл:{" "}
                              {types.find((t) => t.id === q.type_id)?.name ||
                                "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SUMMARY */}
              {selectedQuestionIds.size > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 mb-2">
                    📊 Сонголтын хураангуй:
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold text-green-800">
                        {selectedEasy}
                      </div>
                      <div className="text-green-600">Амархан</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-100 rounded">
                      <div className="font-bold text-yellow-800">
                        {selectedMedium}
                      </div>
                      <div className="text-yellow-600">Дунд</div>
                    </div>
                    <div className="text-center p-2 bg-red-100 rounded">
                      <div className="font-bold text-red-800">
                        {selectedHard}
                      </div>
                      <div className="text-red-600">Хүнд</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Шалгалт үүсгэх ({selectedQuestionIds.size} асуулт,{" "}
            {totalSelectedPoints} оноо)
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- COMPONENTS ----------
function Input(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...rest}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function TextArea(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block mb-1 text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        {...rest}
        rows={3}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}
