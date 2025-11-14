import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockCourses, mockTopics, mockQuestionBank } from "../../data/mockData";
import BackButton from "../../components/BackButton";

// ✅ Types for stronger typing
interface Course {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface Topic {
  id: number;
  courseId: number;
  name: string;
  description: string;
}

interface Question {
  id: number;
  courseId: number;
  topicId: number;
  question: string;
  type: string;
  marks: number;
}

interface FormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
}

export default function CreateExamPage() {
  const navigate = useNavigate();

  // 🧩 For this mock version, we'll use course_id = 1
  const course_id = 1;

  // ✅ State hooks
  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    duration: 120,
    totalMarks: 100,
    passingMarks: 50,
  });

  // Topic selection state: { topicId: questionCount }
  const [selectedTopics, setSelectedTopics] = useState<Record<number, number>>(
    {}
  );

  // ✅ Load mock data
  useEffect(() => {
    const loadData = () => {
      const courseData = mockCourses.find(
        (c) => String(c.id) === String(course_id)
      );
      setCourse(courseData || null);
      setTopics(mockTopics.filter((t) => t.courseId === course_id));
      setQuestionBank(mockQuestionBank.filter((q) => q.courseId === course_id));
      setLoading(false);
    };
    loadData();
  }, [course_id]);

  // ✅ Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle topic question count change
  const handleTopicCountChange = (topicId: number, count: string) => {
    const numCount = parseInt(count) || 0;
    setSelectedTopics((prev) => {
      const updated = { ...prev };
      if (numCount === 0) delete updated[topicId];
      else updated[topicId] = numCount;
      return updated;
    });
  };

  // ✅ Calculate total questions
  const totalQuestions = Object.values(selectedTopics).reduce(
    (sum, count) => sum + count,
    0
  );

  const selectedTopicsList = Object.entries(selectedTopics).map(
    ([topicId, count]) => ({
      topicId: parseInt(topicId),
      questionCount: count,
    })
  );

  // ✅ Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Шалгалтын нэр оруулна уу!");
      return;
    }
    if (totalQuestions === 0) {
      alert("Хамгийн багадаа 1 асуулт сонгоно уу!");
      return;
    }

    const newExam = {
      ...formData,
      courseId: course_id,
      startDateTime: `${formData.startDate}T${formData.startTime}:00Z`,
      selectedTopics: selectedTopicsList,
      totalQuestions,
      status: "upcoming",
      createdAt: new Date().toISOString(),
    };

    console.log("✅ Exam created (mock):", newExam);
    alert(`Шалгалт амжилттай үүсгэлээ! Нийт ${totalQuestions} асуулт.`);

    navigate(`/team6/exams`);
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        ⏳ Ачааллаж байна...
      </div>
    );
  }

  // ✅ UI rendering
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <BackButton variant="link" className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Шинэ шалгалт үүсгэх
          </h1>
          <p className="text-gray-600">
            {course?.name || "Нэргүй хичээл"} — банкнаас асуулт сонгох
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Үндсэн мэдээлэл
            </h2>

            <div className="space-y-4">
              <InputField
                label="Шалгалтын нэр *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Жишээ: Дунд шалгалт"
                required
              />

              <TextAreaField
                label="Тайлбар"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Шалгалтын талаархи мэдээлэл..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Огноо *"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Цаг *"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Үргэлжлэх хугацаа (минут) *"
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min={1}
                />
                <InputField
                  label="Нийт оноо *"
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  required
                  min={1}
                />
                <InputField
                  label="Тэнцэх оноо *"
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  required
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Question Selection */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Асуултын банкнаас сонгох
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Сэдэв бүрээс хэдэн асуулт авахаа сонгоно уу
                </p>
              </div>
              <Link
                to="/team6/question-bank"
                className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Банк харах →
              </Link>
            </div>

            {topics.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Энэ хичээлд сэдэв байхгүй байна
              </div>
            ) : (
              <div className="space-y-4">
                {topics.map((topic) => {
                  const availableQuestions = questionBank.filter(
                    (q) => q.topicId === topic.id
                  );
                  const selectedCount = selectedTopics[topic.id] || 0;

                  return (
                    <div
                      key={topic.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedCount > 0
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {topic.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {topic.description}
                          </p>
                          <div className="text-xs text-gray-500 mt-2">
                            Банкинд байгаа: {availableQuestions.length} асуулт
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">
                              Асуултын тоо
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={availableQuestions.length}
                              value={selectedCount}
                              onChange={(e) =>
                                handleTopicCountChange(topic.id, e.target.value)
                              }
                              className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg text-center focus:border-black focus:outline-none"
                            />
                          </div>
                          {selectedCount > 0 && (
                            <div className="text-green-600 font-bold text-lg">
                              ✓
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Summary */}
            {totalQuestions > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-blue-900">
                      Нийт сонгогдсон асуулт
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      {selectedTopicsList.length} сэдвээс {totalQuestions}{" "}
                      асуулт
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">
                    {totalQuestions}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Шалгалт үүсгэх
            </button>
            <Link
              to={`/team6/exams`}
              className="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
            >
              Болих
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🧩 Reusable Input components
const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
    />
  </div>
);

const TextAreaField = ({
  label,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">
      {label}
    </label>
    <textarea
      {...props}
      rows={3}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
    />
  </div>
);
