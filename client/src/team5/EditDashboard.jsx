import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTION_MODES = [
    { id: "solve", label: "To Solve", desc: "Problem-solving questions" },
    { id: "remember", label: "To Remember", desc: "Memory and recall questions" },
];

const QUESTION_TYPES = [
    { id: "mc", label: "Multiple Choice", desc: "Students select from provided options" },
    { id: "match", label: "Connect/Match", desc: "Students match items from two columns" },
    { id: "fill", label: "Fill in the Blank", desc: "Students complete missing words or phrases" },
    { id: "open", label: "Open Response", desc: "Students write their own answers" },
];

const cardBase = "bg-white border rounded-xl p-4 text-left shadow-sm transition-all";
const cardActive = "border-orange-500 bg-orange-50 ring-2 ring-orange-100";
const cardInactive = "border-gray-200 hover:shadow-md";

const EditDashboard = () => {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    const tryNavigate = (nextMode, nextType) => {
        if (nextMode && nextType) {
            navigate(`/team5/edit/${nextType}/${nextMode}`);
        }
    };

    return (
        <div className="p-6">
            <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:underline">Back to Library</button>
            <h2 className="mt-2 text-2xl font-semibold text-gray-800">Create New Question</h2>

            {/* Modes (top 2) */}
            <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Question Mode</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {QUESTION_MODES.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => {
                                setSelectedMode(m.id);
                                tryNavigate(m.id, selectedType);
                            }}
                            className={`${cardBase} ${selectedMode === m.id ? cardActive : cardInactive}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ${selectedMode === m.id ? "bg-orange-600" : "bg-gray-300"}`}></span>
                                <div>
                                    <div className="font-medium text-gray-800">{m.label}</div>
                                    <div className="text-sm text-gray-500">{m.desc}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Types (bottom 4) */}
            <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">Exercise Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                    {QUESTION_TYPES.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => {
                                setSelectedType(t.id);
                                tryNavigate(selectedMode, t.id);
                            }}
                            className={`${cardBase} ${selectedType === t.id ? cardActive : cardInactive}`}
                        >
                            <div className="flex items-start gap-3">
                                <span className={`mt-1 w-2.5 h-2.5 rounded-full ${selectedType === t.id ? "bg-orange-600" : "bg-gray-300"}`}></span>
                                <div>
                                    <div className="font-medium text-gray-800">{t.label}</div>
                                    <div className="text-sm text-gray-500">{t.desc}</div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EditDashboard;


