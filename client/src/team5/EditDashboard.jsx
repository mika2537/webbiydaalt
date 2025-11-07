import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTION_MODES = [
  { id: "solve", label: "Шийдвэрлэх", desc: "" },
  { id: "remember", label: "Сэргэн санах", desc: "" },
];

const QUESTION_TYPES = [
  { id: "match", label: "Харгалзуулах" },
  { id: "mc", label: "Сонгох" },
  { id: "fill", label: "Нөхөх" },
  { id: "open", label: "Бичих" },
];

export default function EditDashboard() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [question, setQuestion] = useState("");

  const goEditor = (mode, type) => {
    if (mode && type) navigate(`/team5/edit/${type}/${mode}`);
  };

  return (
    <div className="p-6">
      {/* Top bar: menu + title + right CTA */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:underline">
          Back to Library
        </button>
        <button
          onClick={() => navigate("/team5/edit")}
          className="px-4 py-2 rounded-xl bg-neutral-800 text-white shadow"
        >
          Хичээл засварлах
        </button>
      </div>

      {/* Section: tabs like the screenshot */}
      <div className="flex items-center gap-8 mb-6">
        <div className="px-5 py-2 rounded-full bg-gray-200 text-gray-800 font-semibold shadow-inner">
          Асуултын сан
        </div>

        <button
          className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/team5/edit")}
        >
          Асуулт үүсгэх
        </button>
        <button
          className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/team5/assign")}
        >
          Хувиарлах
        </button>
        <button
          className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/team5/progress")}
        >
          Явц
        </button>
        <button
          className="text-lg font-semibold text-gray-700 hover:text-gray-900"
          onClick={() => navigate("/team5/results")}
        >
          Үр Дүн
        </button>
      </div>

      {/* Input + green button */}
      <div className="flex items-stretch gap-3 mb-6">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Шинэ асуултаа энд бичнэ үү."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 bg-white"
        />
        <button
          className="px-5 py-2 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800"
          onClick={() => {/* save later */}}
        >
          Асуулт нэмэх.
        </button>
      </div>

      {/* Titles like the mock */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">Асуултын төрлөө сонгоно уу:</h3>

      {/* Two big mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {QUESTION_MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMode(m.id);
              goEditor(m.id, selectedType);
            }}
            className={`h-20 rounded-md border-2 px-6
                ${selectedMode === m.id ? "border-orange-500 bg-orange-50 shadow" : "border-gray-400 hover:shadow-md"}
            `}
          >
            <div className="w-full h-full flex items-center justify-center text-gray-800 font-medium">
              {m.label}
            </div>
          </button>
        ))}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">Хариултын төрлөө сонгоно уу:</h3>

      {/* Four big answer type cards (2 x 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {QUESTION_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedType(t.id);
              goEditor(selectedMode, t.id);
            }}
            className={`h-16 rounded-md border-2 px-6 flex items-center justify-center gap-3
                ${selectedType === t.id ? "border-orange-500 bg-orange-50 shadow" : "border-gray-400 hover:shadow-md"}
            `}
          >
            <span>{t.label}</span>
            <span className="w-3 h-3 border border-gray-600 rounded-full inline-block" />
          </button>
        ))}
      </div>

      {/* Bottom selects block */}
      <div className="text-lg font-bold text-gray-900 mb-3">
        Харгалзах хичээл, түүний нэг ба сэдвийг сонгно уу:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {["Веб систем ба технологи", "Криптограф", "Хорт шинжилгээ", "Математик"].map((label, i) => (
          <div key={i} className="relative">
            <select className="w-full appearance-none px-4 py-2 rounded-md text-white bg-blue-600 shadow focus:outline-none">
              <option>{label}</option>
              <option>{label} - Сэдэв 1</option>
              <option>{label} - Сэдэв 2</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">▾</span>
          </div>
        ))}
      </div>
    </div>
  );
}



