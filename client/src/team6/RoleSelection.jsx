// team6/RoleSelection.jsx
import React from "react";

const RoleSelection = ({ onRoleSelect }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "3rem", color: "#333" }}>
        Select Your Role
      </h1>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => onRoleSelect("student")}
          style={{
            padding: "2rem 3rem",
            fontSize: "1.5rem",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            minWidth: "200px",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
        >
          👨‍🎓 Student
        </button>
        <button
          onClick={() => onRoleSelect("teacher")}
          style={{
            padding: "2rem 3rem",
            fontSize: "1.5rem",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            minWidth: "200px",
            transition: "all 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0b7dda")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2196F3")}
        >
          👨‍🏫 Teacher
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
