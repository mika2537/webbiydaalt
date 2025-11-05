import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TYPE_LABELS = {
    mc: "Multiple Choice",
    match: "Connect/Match",
    fill: "Fill in the Blank",
    open: "Open Response",
};

const MODE_LABELS = {
    solve: "To Solve",
    remember: "To Remember",
};

const QuestionEditor = () => {
    const { type, mode } = useParams();
    const navigate = useNavigate();

    const typeLabel = TYPE_LABELS[type] || "Unknown Type";
    const modeLabel = MODE_LABELS[mode] || "Unknown Mode";

    const isValid = useMemo(() => TYPE_LABELS[type] && MODE_LABELS[mode], [type, mode]);

    if (!isValid) {
        return (
            <div className="p-6">
                <p className="text-red-600">Invalid editor combination.</p>
                <button onClick={() => navigate("/team5/edit")} className="mt-3 text-orange-700 hover:underline">Back to Edit</button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">{typeLabel}</h2>
                    <p className="text-gray-600">Mode: {modeLabel}</p>
                </div>
                <button onClick={() => navigate("/team5/edit")} className="text-sm text-orange-700 hover:underline">All editors</button>
            </div>

            {/* Placeholder editor body. Replace with the real editor UI for each combination. */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <p className="text-gray-700">Editor UI for <span className="font-medium">{typeLabel}</span> — <span className="font-medium">{modeLabel}</span></p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border rounded-md px-3 py-2" placeholder="Title" />
                    <input className="border rounded-md px-3 py-2" placeholder="Category/Topic" />
                    <textarea className="md:col-span-2 border rounded-md px-3 py-2 min-h-28" placeholder="Question text"></textarea>
                </div>
                <div className="mt-4 flex gap-2">
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-md">Save</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md">Preview</button>
                </div>
            </div>
        </div>
    );
};

export default QuestionEditor;


