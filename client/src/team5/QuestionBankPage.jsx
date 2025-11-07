import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QuestionBankPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState("create"); // "create" or "view"

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Асуултын сан</h1>
            
            {/* Section Toggle */}
            <div className="flex space-x-4 mb-6">
                <button
                    onClick={() => setActiveSection("create")}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeSection === "create" 
                            ? "bg-orange-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Асуулт үүсгэх
                </button>
                <button
                    onClick={() => setActiveSection("view")}
                    className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeSection === "view" 
                            ? "bg-orange-600 text-white" 
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    Асуултууд харах
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                {activeSection === "create" ? (
                    <CreateQuestionSection />
                ) : (
                    <ViewQuestionsSection />
                )}
            </div>
        </div>
    );
};

// Create Question Section Component
const CreateQuestionSection = () => {
    const navigate = useNavigate();

    const questionTypes = [
        {
            id: "video",
            title: "Видео асуулт",
            description: "Видео файл ашиглан асуулт үүсгэх",
            icon: "🎥",
            color: "bg-red-100 border-red-200"
        },
        {
            id: "audio", 
            title: "Дуу асуулт",
            description: "Дуу файл ашиглан асуулт үүсгэх",
            icon: "🎵",
            color: "bg-blue-100 border-blue-200"
        },
        {
            id: "text",
            title: "Текст асуулт",
            description: "Энгийн текст асуулт үүсгэх",
            icon: "📝",
            color: "bg-green-100 border-green-200"
        }
    ];

    const handleCreateQuestion = (type) => {
        // Navigate to specific question creator or open modal
        navigate(`/team5/questions/create/${type}`);
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Асуулт үүсгэх</h2>
            <p className="text-gray-600 mb-6">Асуултын төрлөө сонгоно уу</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {questionTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleCreateQuestion(type.id)}
                        className={`p-6 border-2 rounded-xl text-left transition-all hover:shadow-md hover:scale-105 ${type.color}`}
                    >
                        <div className="text-4xl mb-3">{type.icon}</div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{type.title}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

// View Questions Section Component
const ViewQuestionsSection = () => {
    const [activeTab, setActiveTab] = useState("video");

    const tabs = [
        { id: "video", label: "Видео асуултууд", icon: "🎥" },
        { id: "audio", label: "Дуу асуултууд", icon: "🎵" },
        { id: "text", label: "Текст асуултууд", icon: "📝" }
    ];

    // Mock data - replace with real data
    const mockQuestions = {
        video: [
            { id: 1, title: "Програмчлалын үндэс - Видео 1", date: "2024-01-15", duration: "2:30" },
            { id: 2, title: "Веб хөгжүүлэлт - Видео 2", date: "2024-01-10", duration: "1:45" }
        ],
        audio: [
            { id: 1, title: "Дууны дасгал 1", date: "2024-01-14", duration: "0:45" },
            { id: 2, title: "Хичээлийн дууны материал", date: "2024-01-08", duration: "3:20" }
        ],
        text: [
            { id: 1, title: "Програмчлалын үндсэн ойлголт", date: "2024-01-16", type: "Олон сонголттой" },
            { id: 2, title: "HTML CSS тест", date: "2024-01-12", type: "Нөхөх дасгал" }
        ]
    };

    return (
        <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Асуултууд харах</h2>
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                            activeTab === tab.id 
                                ? "bg-white text-orange-600 shadow-sm" 
                                : "text-gray-600 hover:text-gray-800"
                        }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
                {mockQuestions[activeTab].map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="font-medium text-gray-800">{question.title}</h3>
                                <p className="text-sm text-gray-500">
                                    Огноо: {question.date} 
                                    {question.duration && ` • Үргэлжлэх хугацаа: ${question.duration}`}
                                    {question.type && ` • Төрөл: ${question.type}`}
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                                    Засах
                                </button>
                                <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                                    Устгах
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {mockQuestions[activeTab].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    Энэ төрлийн асуулт олдсонгүй
                </div>
            )}
        </div>
    );
};

export default QuestionBankPage;