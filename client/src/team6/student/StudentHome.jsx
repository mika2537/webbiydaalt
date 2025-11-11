// team6/StudentHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const StudentHome = ({ onLogout }) => {
  const navigate = useNavigate();

  const screens = [
    { name: "My Courses", path: "/team6/student/courses", icon: "📚" },
    { name: "Assignments", path: "/team6/student/assignments", icon: "📝" },
    { name: "Grades", path: "/team6/student/grades", icon: "📊" },
    { name: "Schedule", path: "/team6/student/schedule", icon: "📅" },
    { name: "Library", path: "/team6/student/library", icon: "📖" },
    { name: "Profile", path: "/team6/student/profile", icon: "👤" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", color: "#333" }}>Student Dashboard</h1>
        <button
          onClick={onLogout}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Change Role
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {screens.map((screen, index) => (
          <button
            key={index}
            onClick={() => navigate(screen.path)}
            style={{
              padding: "2rem",
              backgroundColor: "white",
              border: "2px solid #ddd",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s",
              textAlign: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              {screen.icon}
            </div>
            <div
              style={{ fontSize: "1.2rem", color: "#333", fontWeight: "500" }}
            >
              {screen.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudentHome;
