import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./theme.css";
import { API_BASE_URL } from "./main";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/courses`)
      .then((res) => setCourses(res.data.courses))
      .catch(() => setCourses([]));
  }, []);

  return (
    <div style={{ maxWidth: 700, margin: "3rem auto" }}>
      <h2 style={{ color: "var(--primary-orange)", marginBottom: "2rem" }}>
        Available Courses
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              background: "white",
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              padding: "2rem",
              minWidth: 250,
            }}
          >
            <h3 style={{ color: "var(--primary-green)" }}>{course.name}</h3>
            <p>{course.description}</p>
            <button
              className="button"
              onClick={() => navigate(`/course/${course.id}`)}
            >
              Open Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;
