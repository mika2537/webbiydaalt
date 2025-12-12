import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../../components/BackButton";

const API_URL = "http://localhost:3001/api";

// Types
interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
}

type DifficultyLevel = "easy" | "medium" | "hard";

interface Question {
  id: number;
  course_id: number;
  question: string;
  type_id: number;
  level_id: number;
  option?: string[] | null;
  answer?: any;
  lesson_id?: number;
}

interface FormData {
  name: string;
  description: string;
  openDate: string;
  openTime: string;
  endDate: string;
  endTime: string;
  duration: number;
  total_point: number;
  grade_point: number;
  max_attempt: number;
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const { course_id } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<number>>(
    new Set()
  );

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    openDate: "",
    openTime: "",
    endDate: "",
    endTime: "",
    duration: 60,
    total_point: 100,
    grade_point: 50,
    max_attempt: 1,
  });

  // Helper functions
  const getLevelName = (levelId: number): string => {
    const levels: { [key: number]: string } = {
      10: "Сэргээн санах",
      20: "Ойлгох",
      30: "Хэрэглэх",
      40: "Задлан шинжлэх",
      50: "Үнэлэх",
      60: "Бүтээх",
    };
    return levels[levelId] || `Level ${levelId}`;
  };

  const getTypeName = (typeId: number): string => {
    const types: { [key: number]: string } = {
      10: "Үнэн/Худал",
      20: "Нэг сонголттой",
      30: "Олон сонголттой",
      40: "Харгалзуулах",
    };
    return types[typeId] || `Type ${typeId}`;
  };

  // ID 10 = Сэргээн санах, ID 20 = Ойлгох
  const easyQuestions = questionBank.filter(
    (q) => q.level_id === 10 || q.level_id === 20
  );
  // ID 30 = Хэрэглэх, ID 40 = Задлан шинжлэх
  const mediumQuestions = questionBank.filter(
    (q) => q.level_id === 30 || q.level_id === 40
  );
  // ID 50 = Үнэлэх, ID 60 = Бүтээх
  const hardQuestions = questionBank.filter(
    (q) => q.level_id === 50 || q.level_id === 60
  );
  const selectedEasy = easyQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;
  const selectedMedium = mediumQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;
  const selectedHard = hardQuestions.filter((q) =>
    selectedQuestionIds.has(q.id)
  ).length;

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/courses/${course_id}`);
        const courseData = await courseRes.json();
        setCourse(courseData);

        const questionsRes = await fetch(
          `${API_URL}/lms/courses/${course_id}/questions?limit=100`
        );
        const questionsData = await questionsRes.json();
        setQuestionBank(
          Array.isArray(questionsData?.items) ? questionsData.items : []
        );
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadData();
  }, [course_id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleQuestion = (questionId: number) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const toggleAllInSection = (questions: Question[]) => {
    setSelectedQuestionIds((prev) => {
      const newSet = new Set(prev);
      const allSelected = questions.every((q) => newSet.has(q.id));

      if (allSelected) {
        questions.forEach((q) => newSet.delete(q.id));
      } else {
        questions.forEach((q) => newSet.add(q.id));
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Нэр оруулна уу!");
      return;
    }

    if (selectedQuestionIds.size === 0) {
      alert("Дор хаяж 1 асуулт сонгоно уу!");
      return;
    }

    // Шалгалт үүсгэх
    const newExam = {
      course_id: Number(course_id),
      name: formData.name,
      description: formData.description,
      total_point: formData.total_point,
      grade_point: formData.grade_point,
      max_attempt: formData.max_attempt,
      open_on: `${formData.openDate}T${formData.openTime}:00Z`,
      close_on: `${formData.endDate}T${formData.endTime}:00Z`,
      end_on: `${formData.endDate}T${formData.endTime}:00Z`,
      duration: formData.duration,
    };

    try {
      // 1. Шалгалт үүсгэх
      const examRes = await fetch(`${API_URL}/lms/courses/${course_id}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });

      if (!examRes.ok) {
        const errorData = await examRes.json();
        throw new Error(errorData.message || "Failed to create exam");
      }

      const examResult = await examRes.json();
      const newExamId = examResult.id;

      // 2. Асуултуудыг шалгалтанд нэмэх
      // LMS-д асуулт нэмэх endpoint: POST /exams/:exam_id/questions
      const questionsToAdd = Array.from(selectedQuestionIds).map(
        (qid, idx) => ({
          lesson_id: questionBank.find((q) => q.id === qid)?.lesson_id || 200,
          level_id: questionBank.find((q) => q.id === qid)?.level_id || 10,
          type_id: questionBank.find((q) => q.id === qid)?.type_id || 20,
          quantity: 1,
        })
      );

      for (const questionConfig of questionsToAdd) {
        try {
          await fetch(`${API_URL}/lms/exams/${newExamId}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(questionConfig),
          });
        } catch (err) {
          console.error("Failed to add question:", err);
        }
      }

      alert("✅ Шалгалт амжилттай үүсгэлээ!");
      navigate(`/team6/exams/${newExamId}`);
    } catch (error: any) {
      console.error("Create error:", error);
      alert(`Алдаа гарлаа: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <BackButton variant="link" className="mb-4" />

          <h1 className="text-3xl font-bold">Шинэ шалгалт үүсгэх</h1>
          <p className="text-gray-600">{course?.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Үндсэн мэдээлэл</h2>

            <div className="space-y-4">
              <InputField
                label="Шалгалтын нэр *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextAreaField
                label="Тайлбар"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              {/* OPEN DATE AND TIME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Нээх огноо *"
                  type="date"
                  name="openDate"
                  value={formData.openDate}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Нээх цаг *"
                  type="time"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* END DATE AND TIME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Дуусах огноо *"
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Дуусах цаг *"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <InputField
                label="Шалгалт өгөх хугацаа (минут) *"
                type="number"
                min={1}
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                placeholder="Оюутан шалгалтыг хэдэн минутанд бөглөх"
              />

              <InputField
                label="Нийт оноо *"
                type="number"
                name="total_point"
                value={formData.total_point}
                onChange={handleChange}
                min={1}
                required
              />

              <InputField
                label="Тэнцэх оноо *"
                type="number"
                name="grade_point"
                value={formData.grade_point}
                onChange={handleChange}
                min={1}
                required
              />

              <InputField
                label="Оролдлогын тоо *"
                type="number"
                name="max_attempt"
                value={formData.max_attempt}
                onChange={handleChange}
                min={1}
                required
                placeholder="Оюутан хэдэн удаа шалгалт өгч болох"
              />
            </div>
          </div>

          {/* QUESTION SELECTION BY DIFFICULTY */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">
              😊 Амархан (Сэргээн санах, Ойлгох)
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {selectedEasy}/{easyQuestions.length} сонгосон
              </span>
              <button
                type="button"
                onClick={() => toggleAllInSection(easyQuestions)}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
              >
                {easyQuestions.every((q) => selectedQuestionIds.has(q.id))
                  ? "Бүгдийг хасах"
                  : "Бүгдийг сонгох"}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {easyQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedQuestionIds.has(q.id)
                      ? "bg-green-50 border-green-400"
                      : "bg-white border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.has(q.id)}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{q.question}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                          {getTypeName(q.type_id)}
                        </span>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {getLevelName(q.level_id)}
                        </span>
                      </div>
                      {q.option && q.option.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2">
                          Сонголт: {q.option.length} ширхэг
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">
              🤔 Дунд (Хэрэглэх, Задлан шинжлэх)
            </h2>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {selectedMedium}/{mediumQuestions.length} сонгосон
              </span>
              <button
                type="button"
                onClick={() => toggleAllInSection(mediumQuestions)}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                {mediumQuestions.every((q) => selectedQuestionIds.has(q.id))
                  ? "Бүгдийг хасах"
                  : "Бүгдийг сонгох"}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {mediumQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedQuestionIds.has(q.id)
                      ? "bg-yellow-50 border-yellow-400"
                      : "bg-white border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.has(q.id)}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{q.question}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                          {getTypeName(q.type_id)}
                        </span>
                        <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                          {getLevelName(q.level_id)}
                        </span>
                      </div>
                      {q.option && q.option.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2">
                          Сонголт: {q.option.length} ширхэг
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">🔥 Хүнд (Үнэлэх, Бүтээх)</h2>
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {selectedHard}/{hardQuestions.length} сонгосон
              </span>
              <button
                type="button"
                onClick={() => toggleAllInSection(hardQuestions)}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                {hardQuestions.every((q) => selectedQuestionIds.has(q.id))
                  ? "Бүгдийг хасах"
                  : "Бүгдийг сонгох"}
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {hardQuestions.map((q) => (
                <div
                  key={q.id}
                  onClick={() => toggleQuestion(q.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    selectedQuestionIds.has(q.id)
                      ? "bg-red-50 border-red-400"
                      : "bg-white border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.has(q.id)}
                      onChange={() => {}}
                      className="mt-1 w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{q.question}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs mr-2">
                          {getTypeName(q.type_id)}
                        </span>
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                          {getLevelName(q.level_id)}
                        </span>
                      </div>
                      {q.option && q.option.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2">
                          Сонголт: {q.option.length} ширхэг
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUMMARY */}
          {selectedQuestionIds.size > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Нийт дүн</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">
                    {selectedEasy}
                  </div>
                  <div className="text-sm text-gray-600">Амархан</div>
                </div>
                <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-700">
                    {selectedMedium}
                  </div>
                  <div className="text-sm text-gray-600">Дунд</div>
                </div>
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-700">
                    {selectedHard}
                  </div>
                  <div className="text-sm text-gray-600">Хүнд</div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg text-center">
                <p className="text-lg font-bold">
                  Нийт сонгосон асуулт: {selectedQuestionIds.size}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Шалгалт үүсгэх
            </button>

            <Link
              to={`/team6/courses/${course_id}/exams`}
              className="flex-1 py-4 text-center border rounded-lg hover:bg-gray-50"
            >
              Болих
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// COMPONENTS
const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input {...props} className="w-full px-4 py-3 border-2 rounded-lg" />
  </div>
);

const TextAreaField = ({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 border-2 rounded-lg"
    />
  </div>
);
