import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackButton from "../../components/BackButton";

const API_URL = "http://localhost:3001/api";

// Types
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
  endDate: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
}

export default function CreateExamPage() {
  const navigate = useNavigate();
  const course_id = 1;

  const [course, setCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: 120,
    totalMarks: 100,
    passingMarks: 50,
  });

  const [selectedTopics, setSelectedTopics] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await fetch(`${API_URL}/courses/${course_id}`);
        const courseData = await courseRes.json();
        setCourse(courseData);

        const topicRes = await fetch(`${API_URL}/topics/course/${course_id}`);
        const topicsData = await topicRes.json();
        setTopics(Array.isArray(topicsData) ? topicsData : []);

        const bankRes = await fetch(`${API_URL}/questions/course/${course_id}`);
        const bankData = await bankRes.json();
        setQuestionBank(Array.isArray(bankData) ? bankData : []);
      } catch (error) {
        console.error("API Error:", error);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopicCountChange = (topicId: number, count: string) => {
    const numCount = parseInt(count) || 0;
    setSelectedTopics((prev) => {
      const updated = { ...prev };
      if (numCount === 0) delete updated[topicId];
      else updated[topicId] = numCount;
      return updated;
    });
  };

  const totalQuestions = Object.values(selectedTopics).reduce(
    (sum, count) => sum + count,
    0
  );

  const selectedTopicsList = Object.entries(selectedTopics).map(
    ([topicId, count]) => ({
      topicId: Number(topicId),
      questionCount: count,
    })
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Нэр оруулна уу!");
      return;
    }

    if (totalQuestions === 0) {
      alert("1 асуулт заавал сонгоно!");
      return;
    }

    const newExam = {
      ...formData,
      courseId: course_id,
      selectedTopics: selectedTopicsList,
      totalQuestions,
      status: "upcoming",
      createdBy: "Багш",
      createdAt: new Date().toISOString(),
      startDate: `${formData.startDate}T${formData.startTime}:00`,
      endDate: `${formData.endDate}T${formData.endTime}:00`,
      duration: formData.duration,
    };

    try {
      const res = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });

      if (!res.ok) throw new Error("Failed to create exam");

      alert("Шалгалт амжилттай үүсгэлээ!");
      navigate("/team6/courses/1/exams");
    } catch (error) {
      console.error("Create error:", error);
      alert("Алдаа гарлаа!");
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
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <TextAreaField
                label="Тайлбар"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              {/* DATE AND TIME FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Эхлэх огноо *"
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />

                <InputField
                  label="Эхлэх цаг *"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Дуусах огноо * (Оролцох боломжгүй болох)"
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
                name="totalMarks"
                value={formData.totalMarks}
                onChange={handleChange}
                min={1}
                required
              />

              <InputField
                label="Тэнцэх оноо *"
                type="number"
                name="passingMarks"
                value={formData.passingMarks}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
          </div>

          {/* QUESTION SELECTION */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">Асуултын банкнаас сонгох</h2>

              <Link
                to="/team6/question-bank"
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Банк харах →
              </Link>
            </div>

            <div className="space-y-4">
              {topics.map((topic) => {
                const available = questionBank.filter(
                  (q) => q.topicId === topic.id
                );

                return (
                  <div key={topic.id} className="border-2 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold">{topic.name}</h3>
                        <p className="text-sm text-gray-600">
                          {topic.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Нийт: {available.length} асуулт
                        </p>
                      </div>

                      <input
                        type="number"
                        min={0}
                        max={available.length}
                        value={selectedTopics[topic.id] || 0}
                        onChange={(e) =>
                          handleTopicCountChange(topic.id, e.target.value)
                        }
                        className="w-20 border p-2 rounded"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {totalQuestions > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border rounded-lg">
                <p className="font-semibold">
                  Нийт сонгосон асуулт: {totalQuestions}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-black text-white rounded-lg"
            >
              Шалгалт үүсгэх
            </button>

            <Link
              to="/team6/exams"
              className="flex-1 py-4 text-center border rounded-lg"
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
