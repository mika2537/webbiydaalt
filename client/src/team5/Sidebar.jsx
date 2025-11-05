import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiHome, FiBookOpen, FiHelpCircle, FiEdit3, FiTrendingUp, FiUsers, FiSettings, FiX } from "react-icons/fi";
import { GiGraduateCap } from "react-icons/gi";

const Sidebar = ({ isOpen, onClose, user }) => {
    const [activeMenu, setActiveMenu] = useState("courses");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith("/team5/courses")) {
            setActiveMenu("courses");
        }
    }, [location.pathname]);

    const menuItems = [
        { id: "home", label: "Нүүр хуудас", icon: FiHome },
        { id: "courses", label: "Миний хичээлүүд", icon: GiGraduateCap },
        { id: "materials", label: "Сургалтын материал", icon: FiBookOpen },
        { id: "questions", label: "Асуултын сан", icon: FiHelpCircle },
    ];

    const assignmentItems = [
        { id: "edit", label: "Даалгавар засварлах", icon: FiEdit3 },
        { id: "grades", label: "Үнэлгээ, оноо", icon: FiTrendingUp },
        { id: "students", label: "Сурагчдын жагсаалт", icon: FiUsers },
    ];

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Close Button */}
                    <div className="flex justify-end p-4">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                            aria-label="Close menu"
                        >
                            <FiX className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* User Profile Section */}
                    <div className="px-6 pb-6 border-b border-gray-200">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
                                <svg
                                    className="w-12 h-12 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-gray-800">
                                    {user?.first_name} {user?.last_name} /D.IS10/
                                </p>
                                <p className="text-sm text-gray-600">Албан тушаал: Багш</p>
                                <p className="text-xs text-gray-500">Мэйл хаяг: {user?.email || "t.zolboo@must.edu.mn"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="space-y-1 px-3">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.id === "courses") {
                                                setActiveMenu("courses");
                                                navigate("/team5/courses");
                                                onClose?.();
                                            } else if (item.id === "edit") {
                                                setActiveMenu("edit");
                                                navigate("/team5/edit");
                                                onClose?.();
                                            } else {
                                                setActiveMenu(item.id);
                                            }
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                            activeMenu === item.id
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}

                            {/* Assignment Section Header */}
                            <div className="pt-4 pb-2">
                                <p className="px-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                    Даалгавар ба үнэлгээ
                                </p>
                            </div>

                            {assignmentItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            if (item.id === "edit") {
                                                setActiveMenu("edit");
                                                navigate("/team5/edit");
                                                onClose?.();
                                            } else {
                                                setActiveMenu(item.id);
                                            }
                                        }}
                                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                            activeMenu === item.id
                                                ? "bg-orange-100 text-orange-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 mr-3" />
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                );
                            })}

                            {/* Help Section */}
                            <button
                                onClick={() => setActiveMenu("help")}
                                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                                    activeMenu === "help"
                                        ? "bg-orange-100 text-orange-700"
                                        : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                <FiSettings className="w-5 h-5 mr-3" />
                                <span className="font-medium">Тусламж / Заавар</span>
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

