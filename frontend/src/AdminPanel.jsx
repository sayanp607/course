import { useState } from "react";
import axios from "axios";
import AdminCourseManager from "./AdminCourseManager";
import "./theme.css";
import { API_BASE_URL } from "./main";

function AdminPanel() {
  const [courseName, setCourseName] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [message, setMessage] = useState("");

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/api/courses`, {
        name: courseName,
        description: courseDesc,
      });
      setMessage("Course added successfully!");
      setCourseName("");
      setCourseDesc("");
    } catch (err) {
      setMessage("Error adding course.");
    }
  };

  return (
    <div>
      <div
        style={{
          maxWidth: 400,
          margin: "2rem auto",
          background: "white",
          padding: "2rem",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ color: "var(--primary-orange)" }}>Admin Panel</h2>
        <form onSubmit={handleAddCourse}>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: "1rem",
            }}
          />
          <textarea
            placeholder="Course Description"
            value={courseDesc}
            onChange={(e) => setCourseDesc(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: 6,
              border: "1px solid #ccc",
              marginBottom: "1rem",
            }}
          />
          <button className="button" type="submit">
            Add Course
          </button>
        </form>
        {message && (
          <div
            style={{
              marginTop: "1rem",
              color: message.includes("success") ? "green" : "red",
            }}
          >
            {message}
          </div>
        )}
      </div>
      <AdminCourseManager />
    </div>
  );
}

export default AdminPanel;
