// src/team5/CreateQuestionSection.jsx
import { useNavigate } from "react-router-dom";

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

export default CreateQuestionSection;