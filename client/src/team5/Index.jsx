import { useState, useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Sidebar from "./Sidebar";
import ContentHeader from "./ContentHeader";
import CourseGrid from "./CourseGrid";
import CoursesPage from "./CoursesPage";
import EditDashboard from "./EditDashboard";
import QuestionEditor from "./QuestionEditor";
import { FiMenu } from "react-icons/fi";

const Index = () => {
    const { user: contextUser } = useContext(UserContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Static mock user for development
    const staticUser = {
        id: 1,
        first_name: "Т",
        last_name: "ЗОЛБОО",
        email: "t.zolboo@must.edu.mn",
    };

    // Use context user if available, otherwise use static user
    const user = contextUser || staticUser;

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Force fullscreen view and hide parent layout elements
    useEffect(() => {
        const rootElement = document.getElementById('root');
        const body = document.body;
        
        if (rootElement) {
            rootElement.style.height = '100vh';
            rootElement.style.overflow = 'hidden';
        }
        
        // Hide header and footer
        const hideLayoutElements = () => {
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            const main = document.querySelector('main');
            
            if (header) header.style.display = 'none';
            if (footer) footer.style.display = 'none';
            if (main) {
                main.style.padding = '0';
                main.style.margin = '0';
            }
            
            // Make body fullscreen
            body.style.margin = '0';
            body.style.padding = '0';
        };
        
        hideLayoutElements();
        
        return () => {
            if (rootElement) {
                rootElement.style.height = '';
                rootElement.style.overflow = '';
            }
            
            // Restore layout elements
            const header = document.querySelector('header');
            const footer = document.querySelector('footer');
            const main = document.querySelector('main');
            
            if (header) header.style.display = '';
            if (footer) footer.style.display = '';
            if (main) {
                main.style.padding = '';
                main.style.margin = '';
            }
            
            body.style.margin = '';
            body.style.padding = '';
        };
    }, [])

    return (
        <div className="fixed inset-0 flex bg-gray-100">
            {/* Menu Button - Top Left */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
            >
                <FiMenu className="w-6 h-6 text-gray-700" />
            </button>

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} user={user} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-0 transition-all duration-300">
                <ContentHeader />
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route index element={<Navigate to="courses" replace />} />
                        <Route path="courses" element={<CoursesPage />} />
                        <Route path="edit" element={<EditDashboard />} />
                        <Route path="edit/:type/:mode" element={<QuestionEditor />} />
                        {/* Fallback to courses for unknown paths under team5 */}
                        <Route path="*" element={<Navigate to="courses" replace />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

export default Index;
