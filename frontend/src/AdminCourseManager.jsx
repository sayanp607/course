import { useEffect, useState } from "react";
import axios from "axios";
import "./theme.css";
import { API_BASE_URL } from "./main";

function AdminCourseManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [subsections, setSubsections] = useState([]);
  const [subTitle, setSubTitle] = useState("");
  const [subType, setSubType] = useState("text");
  const [content, setContent] = useState("");
  const [videoInputs, setVideoInputs] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/courses`)
      .then((res) => setCourses(res.data.courses));
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      axios
        .get(`${API_BASE_URL}/api/subsections/${selectedCourse.id}`)
        .then((res) => setSubsections(res.data.subsections));
    } else {
      setSubsections([]);
    }
  }, [selectedCourse]);

  const handleAddSubsection = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const subRes = await axios.post(`${API_BASE_URL}/api/subsections`, {
        courseId: selectedCourse.id,
        title: subTitle,
        type: subType,
      });
      if (subType === "text") {
        await axios.post(`${API_BASE_URL}/api/subsections/text`, {
          subsectionId: subRes.data.subsection.id,
          content,
        });
      }
      setMessage("Subsection added!");
      setSubTitle("");
      setContent("");
      setSubType("text");
      axios
        .get(`${API_BASE_URL}/api/subsections/${selectedCourse.id}`)
        .then((res) => setSubsections(res.data.subsections));
    } catch {
      setMessage("Error adding subsection.");
    }
  };

  const handleAddVideo = async (subsectionId) => {
    setMessage("");
    const { title, url, duration, textAbove, textBelow, pdfFile } =
      videoInputs[subsectionId] || {};
    if (!title || !url || !duration) return;
    try {
      const formData = new FormData();
      formData.append("subsectionId", subsectionId);
      formData.append("title", title);
      formData.append("url", url);
      formData.append("duration", duration);
      formData.append("textAbove", textAbove || "");
      formData.append("textBelow", textBelow || "");
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }
      // Debug: log FormData keys and values
      for (let pair of formData.entries()) {
        console.log(pair[0] + ":", pair[1]);
      }
      await axios.post(
        `${API_BASE_URL}/api/subsections/video`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Video added!");
      setVideoInputs((inputs) => ({
        ...inputs,
        [subsectionId]: {
          title: "",
          url: "",
          duration: "",
          textAbove: "",
          textBelow: "",
          pdfFile: null,
        },
      }));
      axios
        .get(`${API_BASE_URL}/api/subsections/${selectedCourse.id}`)
        .then((res) => setSubsections(res.data.subsections));
    } catch (err) {
      setMessage("Error adding video.");
      // Debug: log error response
      if (err.response) {
        console.log("Error response:", err.response.data);
      } else {
        console.log("Error:", err);
      }
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        background: "white",
        padding: "2rem",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ color: "var(--primary-orange)" }}>
        Manage Courses & Subsections
      </h2>
      <div style={{ marginBottom: "2rem" }}>
        <label style={{ fontWeight: "bold" }}>Select Course:</label>
        <select
          value={selectedCourse?.id || ""}
          onChange={(e) =>
            setSelectedCourse(
              courses.find((c) => c.id === Number(e.target.value))
            )
          }
          style={{ marginLeft: "1rem", padding: "0.5rem", borderRadius: 6 }}
        >
          <option value="">-- Select --</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>
      {selectedCourse && (
        <>
          <form onSubmit={handleAddSubsection} style={{ marginBottom: "2rem" }}>
            <h3 style={{ color: "var(--primary-green)" }}>Add Subsection</h3>
            <input
              type="text"
              placeholder="Subsection Title"
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            />
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                marginBottom: "1rem",
              }}
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
            </select>
            {subType === "text" && (
              <textarea
                placeholder="Text Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: "1rem",
                }}
              />
            )}
            <button className="button" type="submit">
              Add Subsection
            </button>
          </form>
          <div>
            <h3 style={{ color: "var(--primary-green)" }}>Subsections</h3>
            {subsections.map((sub) => (
              <div
                key={sub.id}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: "#f9fbe7",
                  borderRadius: 8,
                }}
              >
                <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                  {sub.title} ({sub.type})
                </div>
                {sub.type === "video" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddVideo(sub.id);
                    }}
                    style={{ marginBottom: "1rem" }}
                    encType="multipart/form-data"
                  >
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={videoInputs[sub.id]?.title || ""}
                      onChange={(e) =>
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            title: e.target.value,
                          },
                        }))
                      }
                      required
                      style={{
                        width: "40%",
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginRight: "1rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Video URL"
                      value={videoInputs[sub.id]?.url || ""}
                      onChange={(e) =>
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            url: e.target.value,
                          },
                        }))
                      }
                      required
                      style={{
                        width: "40%",
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginRight: "1rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g. 01:09)"
                      value={videoInputs[sub.id]?.duration || ""}
                      onChange={(e) =>
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            duration: e.target.value,
                          },
                        }))
                      }
                      required
                      style={{
                        width: "15%",
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginRight: "1rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Text Above (optional)"
                      value={videoInputs[sub.id]?.textAbove || ""}
                      onChange={(e) =>
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            textAbove: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginTop: "0.5rem",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Text Below (optional)"
                      value={videoInputs[sub.id]?.textBelow || ""}
                      onChange={(e) =>
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            textBelow: e.target.value,
                          },
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "0.5rem",
                        borderRadius: 6,
                        border: "1px solid #ccc",
                        marginBottom: "0.5rem",
                      }}
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        setVideoInputs((inputs) => ({
                          ...inputs,
                          [sub.id]: {
                            ...inputs[sub.id],
                            pdfFile: file || null,
                          },
                        }));
                      }}
                      style={{
                        marginBottom: "0.5rem",
                        display: "block",
                      }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#888" }}>
                      PDF (optional)
                    </span>
                    <button className="button" type="submit">
                      Add Video
                    </button>
                  </form>
                )}
                {sub.videos && sub.videos.length > 0 && (
                  <div style={{ marginLeft: "1rem" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "var(--primary-orange)",
                      }}
                    >
                      Videos:
                    </div>
                    {sub.videos.map((video) => (
                      <div key={video.id} style={{ marginBottom: "0.5rem" }}>
                        <div>{video.title}</div>
                        {video.url &&
                        (video.url.includes("youtube.com") ||
                          video.url.includes("youtu.be")) ? (
                          <iframe
                            width="320"
                            height="180"
                            src={`https://www.youtube.com/embed/${
                              video.url.includes("youtube.com")
                                ? video.url.split("v=")[1]?.split("&")[0]
                                : video.url.split("youtu.be/")[1]?.split("?")[0]
                            }`}
                            title={video.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ marginTop: "0.5rem" }}
                          />
                        ) : (
                          <video
                            width="320"
                            height="180"
                            controls
                            style={{ marginTop: "0.5rem" }}
                          >
                            <source src={video.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                        {/* Show PDF link if available */}
                        {video.pdf_url && (
                          <div style={{ marginTop: "0.5rem" }}>
                            <a
                              href={`${API_BASE_URL}${video.pdf_url}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#1976d2",
                                textDecoration: "underline",
                                fontWeight: "bold",
                              }}
                            >
                              View PDF
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {sub.texts && sub.texts.length > 0 && (
                  <div style={{ marginLeft: "1rem" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "var(--primary-green)",
                      }}
                    >
                      Text:
                    </div>
                    {sub.texts.map((text) => (
                      <div
                        key={text.id}
                        style={{
                          marginBottom: "0.5rem",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {text.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {message && (
        <div
          style={{
            marginTop: "1rem",
            color: message.includes("added") ? "green" : "red",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}

export default AdminCourseManager;
