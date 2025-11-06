// src/team5/ViewQuestionsSection.jsx
import { useState } from "react";

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

export default ViewQuestionsSection;