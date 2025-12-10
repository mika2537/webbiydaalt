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

interface Topic {
  id: number;
  course_id: number;
  name: string;
  description: string;
}

type DifficultyLevel = "easy" | "medium" | "hard";

interface Question {
  id: number;
  course_id: number;
  topicId: number;
  question: string;
  type: string;
  marks: number;
  levels: DifficultyLevel;
  levelId: number;
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
  const [topics, setTopics] = useState<Topic[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState<any[]>([]);

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

  const [selectedTopics, setSelectedTopics] = useState<Record<string, number>>(
    {}
  );

  const [selectedDifficulties, setSelectedDifficulties] = useState<
    Record<string, number>
  >({});

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

        const levelRes = await fetch(`${API_URL}/question-levels`);
        const levelData = await levelRes.json();
        setLevels(levelData.items || []);
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

  const totalDifficultyQuestions = Object.values(selectedDifficulties).reduce(
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

    if (!formData.name.trim()) {
      alert("Нэр оруулна уу!");
      return;
    }

    if (totalQuestions === 0 && totalDifficultyQuestions === 0) {
      alert("1 асуулт заавал сонгоно!");
      return;
    }

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
      selectedTopics: selectedTopicsList,
      selectedDifficulties,
      totalQuestions: totalQuestions + totalDifficultyQuestions,
    };

    try {
      const res = await fetch(`${API_URL}/exams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });

      if (!res.ok) throw new Error("Failed to create exam");

      alert("Шалгалт амжилттай үүсгэлээ!");
      navigate(`/team6/courses/${course_id}/exams`);
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

          {/* QUESTION SELECTION BY TOPIC */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold">
                Асуултын банкнаас сэдвээр сонгох
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/team6/courses/${course_id}/questions`)
                  }
                  className="inline-block mb-4 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Асуултын банк руу очих
                </button>
              </h2>
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
                  Сэдвээр сонгосон нийт асуулт: {totalQuestions}
                </p>
              </div>
            )}
          </div>

          {/* QUESTION SELECTION BY DIFFICULTY */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">
              Асуултыг хүндийн түвшнээр сонгох
            </h2>

            {/* Group Levels by Difficulty (Bloom-style ranges) */}
            {[
              { key: "easy", title: "Хялбар", min: 0, max: 20 },
              { key: "medium", title: "Дунд", min: 30, max: 40 },
              { key: "hard", title: "Хэцүү", min: 50, max: 60 },
            ].map((group) => {
              const filteredLevels = levels.filter(
                (lv: any) =>
                  lv.priority >= group.min && lv.priority <= group.max
              );

              if (filteredLevels.length === 0) return null;

              return (
                <div key={group.key} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">
                    {group.title} түвшин
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredLevels.map((level: any) => {
                      const available = questionBank.filter(
                        (q) => q.levelId === level.id
                      );

                      return (
                        <div
                          key={level.id}
                          className="border-2 p-4 rounded-lg shadow-sm bg-white"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold">{level.name}</span>
                            <span className="text-sm text-gray-500">
                              Нийт: {available.length}
                            </span>
                          </div>

                          <input
                            type="number"
                            min={0}
                            max={available.length}
                            value={selectedDifficulties[level.id] || 0}
                            onChange={(e) => {
                              const count = parseInt(e.target.value) || 0;
                              setSelectedDifficulties((prev: any) => ({
                                ...prev,
                                [level.id]: count,
                              }));
                            }}
                            className="w-full border p-2 rounded"
                            placeholder="Асуулт тоо"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {totalDifficultyQuestions > 0 && (
              <div className="mt-4 p-4 bg-green-50 border rounded-lg">
                <p className="font-semibold">
                  Хүндээр сонгосон нийт асуулт: {totalDifficultyQuestions}
                </p>
              </div>
            )}
          </div>

          {/* TOTAL SUMMARY */}
          {(totalQuestions > 0 || totalDifficultyQuestions > 0) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Нийт дүн</h2>
              <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <p className="text-lg font-bold">
                  Бүх асуултын нийлбэр:{" "}
                  {totalQuestions + totalDifficultyQuestions}
                </p>
                <div className="mt-2 text-sm text-gray-700">
                  <p>• Сэдвээр сонгосон: {totalQuestions}</p>
                  <p>• Хүндээр сонгосон: {totalDifficultyQuestions}</p>
                </div>
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
